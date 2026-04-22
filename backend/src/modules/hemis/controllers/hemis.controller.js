import { query } from '../../../config/db.js';

export const listStudents = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT sp.id, sp.student_code, u.full_name, u.email
       FROM student_profiles sp
       JOIN users u ON u.id = sp.user_id
       WHERE sp.tenant_id = $1
       ORDER BY u.full_name ASC`,
      [req.tenantId]
    );
    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
};

export const calculateGpa = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT COALESCE(AVG(score / NULLIF(max_score,0) * 4), 0)::numeric(4,2) AS gpa
       FROM gradebook
       WHERE tenant_id = $1 AND student_profile_id = $2`,
      [req.tenantId, req.params.studentId]
    );
    res.json({ studentId: req.params.studentId, gpa: result.rows[0].gpa });
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const { groupId, studentProfileId, lessonDate, status } = req.body;
    const result = await query(
      `INSERT INTO attendances (tenant_id, group_id, student_profile_id, lesson_date, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (group_id, student_profile_id, lesson_date)
       DO UPDATE SET status = EXCLUDED.status
       RETURNING *`,
      [req.tenantId, groupId, studentProfileId, lessonDate, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
