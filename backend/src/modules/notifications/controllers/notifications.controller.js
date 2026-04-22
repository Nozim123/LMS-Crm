import { query } from '../../../config/db.js';

export const sendNotification = async (req, res, next) => {
  try {
    const { channel, recipient, message } = req.body;
    const result = await query(
      `INSERT INTO notifications (tenant_id, channel, recipient, message, status)
       VALUES ($1, $2, $3, $4, 'queued')
       RETURNING *`,
      [req.tenantId, channel, recipient, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
