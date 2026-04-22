import { query } from '../../../config/db.js';

export const listCourses = async (req, res, next) => {
  try {
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
       WHERE c.tenant_id = $1
       ORDER BY c.created_at DESC`,
      [req.tenantId, req.user.sub]
    );

    const items = result.rows.map((row) => {
      const total = row.total_lessons + row.total_quizzes;
      const completed = row.completed_lessons + row.completed_quizzes;
      const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...row, completionPercent };
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

export const addLesson = async (req, res, next) => {
  try {
    const { title, chapterTitle = 'General', videoUrl = null } = req.body;

    const orderResult = await query(
      `SELECT COALESCE(MAX(order_no), 0) + 1 AS next_order
       FROM lessons
       WHERE course_id = $1 AND tenant_id = $2`,
      [req.params.courseId, req.tenantId]
    );

    const result = await query(
      `INSERT INTO lessons (tenant_id, course_id, title, order_no, video_url, chapter_title)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.tenantId, req.params.courseId, title, orderResult.rows[0].next_order, videoUrl, chapterTitle]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const listLessons = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, order_no, video_url, chapter_title
       FROM lessons
       WHERE tenant_id = $1 AND course_id = $2
       ORDER BY order_no ASC`,
      [req.tenantId, req.params.courseId]
    );

    res.json({ items: result.rows });
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
