export const getPipeline = async (req, res) => {
  res.json({
    tenantId: req.tenantId,
    stages: ['new_lead', 'contacted', 'trial', 'enrolled']
  });
};

export const createLead = async (req, res) => {
  res.status(201).json({
    message: 'Lead created',
    tenantId: req.tenantId,
    lead: req.body
  });
};
