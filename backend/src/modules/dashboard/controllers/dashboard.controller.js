import { query } from '../../../config/db.js';

export const getOverview = async (req, res, next) => {
  try {
    const [students, revenue, attendance] = await Promise.all([
      query('SELECT COUNT(*)::int AS count FROM student_profiles WHERE tenant_id = $1', [req.tenantId]),
      query('SELECT COALESCE(SUM(amount),0)::numeric(12,2) AS total FROM payments WHERE tenant_id = $1', [req.tenantId]),
      query(`SELECT COALESCE(AVG(CASE WHEN status='present' THEN 100 ELSE 0 END), 0)::numeric(5,2) AS rate
             FROM attendances WHERE tenant_id = $1`, [req.tenantId])
    ]);

    res.json({
      stats: {
        studentsCount: students.rows[0].count,
        monthlyRevenue: revenue.rows[0].total,
        attendanceRate: attendance.rows[0].rate
      }
    });
  } catch (error) {
    next(error);
  }
};
