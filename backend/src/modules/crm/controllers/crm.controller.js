import { query } from '../../../config/db.js';
import { writeAuditLog } from '../../../utils/audit.js';

export const getPipeline = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT stage, COUNT(*)::int AS count
       FROM leads
       WHERE tenant_id = $1
       GROUP BY stage`,
      [req.tenantId]
    );

    res.json({ tenantId: req.tenantId, stages: result.rows });
  } catch (error) {
    next(error);
  }
};

export const listLeads = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, student_name, parent_name, phone, source, stage, created_at
       FROM leads
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [req.tenantId]
    );
    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const { studentName, parentName, phone, source, stage = 'new_lead' } = req.body;
    const result = await query(
      `INSERT INTO leads (tenant_id, student_name, parent_name, phone, source, stage, owner_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.tenantId, studentName, parentName, phone, source, stage, req.user.sub]
    );
    await writeAuditLog({
      tenantId: req.tenantId,
      actorUserId: req.user.sub,
      action: 'CREATE_LEAD',
      entityType: 'lead',
      entityId: result.rows[0].id,
      payload: result.rows[0]
    });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const addLeadNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const result = await query(
      `INSERT INTO lead_notes (tenant_id, lead_id, note, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.tenantId, req.params.id, note, req.user.sub]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
