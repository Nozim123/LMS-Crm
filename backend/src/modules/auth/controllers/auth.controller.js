import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { query } from '../../../config/db.js';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role = 'Admin' } = req.body;
    const tenantId = req.headers['x-tenant-id'];

    const hash = await bcrypt.hash(password, 10);
    const userResult = await query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email`,
      [fullName, email, hash]
    );

    await query(
      `INSERT INTO tenant_users (tenant_id, user_id, role)
       VALUES ($1, $2, $3)`,
      [tenantId, userResult.rows[0].id, role]
    );

    return res.status(201).json({ user: userResult.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tenantId = req.headers['x-tenant-id'];

    if (email === env.masterAdminEmail && password === env.masterAdminPassword) {
      const payload = {
        sub: 'master-admin',
        email,
        roles: ['SuperAdmin', 'Admin', 'Teacher', 'Student', 'Parent'],
        activeRole: 'SuperAdmin',
        tenantId,
        fullAccess: true
      };
      const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '12h' });
      return res.json({ accessToken, user: payload });
    }

    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.password_hash, tu.role
       FROM users u
       JOIN tenant_users tu ON tu.user_id = u.id
       WHERE u.email = $1 AND tu.tenant_id = $2`,
      [email, tenantId]
    );

    if (!result.rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const roles = [...new Set(result.rows.map((r) => r.role))];
    const activeRole = roles[0];

    const payload = {
      sub: user.id,
      email: user.email,
      roles,
      activeRole,
      tenantId,
      fullAccess: roles.includes('SuperAdmin')
    };

    const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '8h' });
    return res.json({ accessToken, user: payload });
  } catch (error) {
    next(error);
  }
};
