import { query } from '../../../config/db.js';

const toPercent = (completed, total) => (total > 0 ? Math.round((completed / total) * 100) : 0);

export const listCourses = async (req, res, next) => {
  try {
    const { status } = req.query;
    const params = [req.tenantId, req.user.sub];
    const statusClause = status && status !== 'All' ? `AND c.status = $3` : '';
    if (status && status !== 'All') params.push(status);

    const result = await query(
      `SELECT c.id,
              c.title,
              c.description,
              c.is_published,
              c.status,
              c.level,
              c.instructor_name,
              c.created_at,
              COALESCE((SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id), 0)::int AS total_lessons,
              COALESCE((SELECT COUNT(*) FROM quizzes q WHERE q.lesson_id IN (SELECT l2.id FROM lessons l2 WHERE l2.course_id = c.id)), 0)::int AS total_quizzes,
              COALESCE((
                SELECT COUNT(*)
                FROM lesson_progress lp
                JOIN lessons l3 ON l3.id = lp.lesson_id
                JOIN student_profiles sp ON sp.id = lp.student_profile_id
                WHERE l3.course_id = c.id
                  AND sp.user_id = $2
                  AND lp.is_completed = TRUE
              ), 0)::int AS completed_lessons,
              COALESCE((
                SELECT COUNT(DISTINCT qa.quiz_id)
                FROM quiz_attempts qa
                JOIN student_profiles sp ON sp.id = qa.student_profile_id
                JOIN quizzes q2 ON q2.id = qa.quiz_id
                JOIN lessons l4 ON l4.id = q2.lesson_id
                WHERE l4.course_id = c.id
                  AND sp.user_id = $2
              ), 0)::int AS completed_quizzes
       FROM courses c
       WHERE c.tenant_id = $1 ${statusClause}
       ORDER BY c.created_at DESC`,
      params
    );

    const items = result.rows.map((row) => {
      const total = row.total_lessons + row.total_quizzes;
      const completed = row.completed_lessons + row.completed_quizzes;
      return { ...row, completionPercent: toPercent(completed, total) };
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, level = 'Beginner', status = 'Draft', instructorName } = req.body;
    const result = await query(
      `INSERT INTO courses (tenant_id, title, description, teacher_user_id, level, status, instructor_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.tenantId, title, description, req.user.sub, level, status, instructorName || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const addChapter = async (req, res, next) => {
  try {
    const { title, description = '' } = req.body;

    const orderResult = await query(
      `SELECT COALESCE(MAX(order_no), 0) + 1 AS next_order
       FROM chapters
       WHERE course_id = $1 AND tenant_id = $2`,
      [req.params.courseId, req.tenantId]
    );

    const result = await query(
      `INSERT INTO chapters (tenant_id, course_id, title, description, order_no)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.tenantId, req.params.courseId, title, description, orderResult.rows[0].next_order]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const addLesson = async (req, res, next) => {
  try {
    const { title, chapterTitle = 'General', videoUrl = null, chapterId = null } = req.body;

    const orderResult = await query(
      `SELECT COALESCE(MAX(order_no), 0) + 1 AS next_order
       FROM lessons
       WHERE course_id = $1 AND tenant_id = $2`,
      [req.params.courseId, req.tenantId]
    );

    const result = await query(
      `INSERT INTO lessons (tenant_id, course_id, chapter_id, title, order_no, video_url, chapter_title)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.tenantId, req.params.courseId, chapterId, title, orderResult.rows[0].next_order, videoUrl, chapterTitle]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const listLessons = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT l.id, l.title, l.order_no, l.video_url, l.chapter_title, l.chapter_id,
              c.title AS chapter_name,
              COALESCE((
                SELECT lp.is_completed
                FROM lesson_progress lp
                JOIN student_profiles sp ON sp.id = lp.student_profile_id
                WHERE lp.lesson_id = l.id AND sp.user_id = $3
                LIMIT 1
              ), FALSE) AS is_completed
       FROM lessons l
       LEFT JOIN chapters c ON c.id = l.chapter_id
       WHERE l.tenant_id = $1 AND l.course_id = $2
       ORDER BY l.order_no ASC`,
      [req.tenantId, req.params.courseId, req.user.sub]
    );

    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
};

export const toggleLessonCompletion = async (req, res, next) => {
  try {
    const { completed } = req.body;

    const student = await query(
      `SELECT id FROM student_profiles WHERE tenant_id = $1 AND user_id = $2 LIMIT 1`,
      [req.tenantId, req.user.sub]
    );

    if (!student.rows[0]) {
      return res.status(400).json({ message: 'Student profile not found for user.' });
    }

    const studentProfileId = student.rows[0].id;

    const result = await query(
      `INSERT INTO lesson_progress (tenant_id, lesson_id, student_profile_id, is_completed, completed_at)
       VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN NOW() ELSE NULL END)
       ON CONFLICT (lesson_id, student_profile_id)
       DO UPDATE SET is_completed = EXCLUDED.is_completed,
                     completed_at = CASE WHEN EXCLUDED.is_completed THEN NOW() ELSE NULL END
       RETURNING *`,
      [req.tenantId, req.params.lessonId, studentProfileId, Boolean(completed)]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const courseDetails = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const [courseRes, firstLessonRes, studentsRes, chaptersRes] = await Promise.all([
      query(
        `SELECT id, title, description, instructor_name, status, level
         FROM courses
         WHERE id = $1 AND tenant_id = $2`,
        [courseId, req.tenantId]
      ),
      query(
        `SELECT id, title, chapter_title, video_url
         FROM lessons
         WHERE tenant_id = $1 AND course_id = $2
         ORDER BY order_no ASC
         LIMIT 1`,
        [req.tenantId, courseId]
      ),
      query(
        `SELECT sp.id AS student_profile_id,
                u.full_name,
                COUNT(DISTINCT l.id)::int AS total_lessons,
                COUNT(DISTINCT CASE WHEN lp.is_completed THEN l.id END)::int AS completed_lessons
         FROM course_enrollments ce
         JOIN student_profiles sp ON sp.id = ce.student_profile_id
         JOIN users u ON u.id = sp.user_id
         LEFT JOIN lessons l ON l.course_id = ce.course_id
         LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_profile_id = sp.id
         WHERE ce.tenant_id = $1 AND ce.course_id = $2
         GROUP BY sp.id, u.full_name
         ORDER BY u.full_name ASC`,
        [req.tenantId, courseId]
      ),
      query(
        `SELECT id, title, description, order_no
         FROM chapters
         WHERE tenant_id = $1 AND course_id = $2
         ORDER BY order_no ASC`,
        [req.tenantId, courseId]
      )
    ]);

    if (!courseRes.rows[0]) return res.status(404).json({ message: 'Course not found' });

    const students = studentsRes.rows.map((s) => ({
      ...s,
      progress: toPercent(s.completed_lessons, s.total_lessons)
    }));

    res.json({
      course: courseRes.rows[0],
      preview: {
        introduction: courseRes.rows[0].description,
        firstLesson: firstLessonRes.rows[0] || null
      },
      students,
      chapters: chaptersRes.rows
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId, studentProfileId, answers } = req.body;

    const questions = await query(
      `SELECT id, correct_option FROM quiz_questions WHERE tenant_id = $1 AND quiz_id = $2`,
      [req.tenantId, quizId]
    );

    const total = questions.rows.length || 1;
    const correct = questions.rows.filter((q) => answers?.[q.id] === q.correct_option).length;
    const score = Number(((correct / total) * 100).toFixed(2));

    const result = await query(
      `INSERT INTO quiz_attempts (tenant_id, quiz_id, student_profile_id, answers, score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.tenantId, quizId, studentProfileId, answers || {}, score]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
