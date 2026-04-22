export const listCourses = async (req, res) => {
  res.json({ tenantId: req.tenantId, items: [] });
};

export const submitHomework = async (req, res) => {
  res.status(201).json({ tenantId: req.tenantId, submission: req.body });
};
