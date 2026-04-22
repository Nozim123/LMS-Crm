export const getAttendance = async (req, res) => {
  res.json({ tenantId: req.tenantId, records: [] });
};

export const calculateGpa = async (req, res) => {
  res.json({ tenantId: req.tenantId, gpa: 0 });
};
