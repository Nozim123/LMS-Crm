import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';

export const login = async (req, res) => {
  const { email } = req.body;

  // TODO: validate password and tenant membership using DB
  const payload = {
    sub: 'user-id-placeholder',
    email,
    role: 'Admin',
    tenantId: req.headers['x-tenant-id']
  };

  const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '8h' });
  return res.json({ accessToken, user: payload });
};
