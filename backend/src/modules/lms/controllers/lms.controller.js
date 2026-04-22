import { query } from '../../../config/db.js';

export const listCourses = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, description, is_published, created_at
       FROM courses
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [req.tenantId]
    );
    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const result = await query(
      `INSERT INTO courses (tenant_id, title, description, teacher_user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.tenantId, title, description, req.user.sub]
    );
    res.status(201).json(result.rows[0]);
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
