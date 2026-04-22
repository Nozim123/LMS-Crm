import { query } from '../../../config/db.js';

export const listInvoices = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, student_profile_id, amount, due_date, status, created_at
       FROM invoices WHERE tenant_id = $1 ORDER BY due_date DESC`,
      [req.tenantId]
    );
    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { studentProfileId, amount, dueDate, status = 'unpaid' } = req.body;
    const result = await query(
      `INSERT INTO invoices (tenant_id, student_profile_id, amount, due_date, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.tenantId, studentProfileId, amount, dueDate, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, provider = 'Cash', providerTxnId } = req.body;
    const result = await query(
      `INSERT INTO payments (tenant_id, invoice_id, amount, provider, provider_txn_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.tenantId, invoiceId, amount, provider, providerTxnId]
    );

    await query(
      `UPDATE invoices
       SET status = CASE WHEN amount <= (SELECT COALESCE(SUM(amount),0) FROM payments WHERE invoice_id = $1) THEN 'paid' ELSE 'partial' END
       WHERE id = $1 AND tenant_id = $2`,
      [invoiceId, req.tenantId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const debtSummary = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT COALESCE(SUM(amount),0)::numeric(12,2) AS outstanding
       FROM invoices
       WHERE tenant_id = $1 AND status IN ('unpaid', 'partial', 'overdue')`,
      [req.tenantId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
