import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  masterAdminEmail: process.env.MASTER_ADMIN_EMAIL || 'admin@educore.local',
  masterAdminPassword: process.env.MASTER_ADMIN_PASSWORD || 'Admin123!'
};
