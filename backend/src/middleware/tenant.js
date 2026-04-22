export const tenantMiddleware = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  req.tenantId = tenantId;
  next();
};
