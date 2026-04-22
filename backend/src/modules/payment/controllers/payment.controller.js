export const listInvoices = async (req, res) => {
  res.json({ tenantId: req.tenantId, invoices: [] });
};

export const createPayment = async (req, res) => {
  res.status(201).json({ tenantId: req.tenantId, payment: req.body });
};
