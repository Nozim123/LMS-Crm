export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err.code === '23505') {
    return res.status(409).json({ message: 'Duplicate record' });
  }
  return res.status(500).json({ message: err.message || 'Internal server error' });
};
