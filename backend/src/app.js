import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/routes/auth.routes.js';
import crmRoutes from './modules/crm/routes/crm.routes.js';
import lmsRoutes from './modules/lms/routes/lms.routes.js';
import hemisRoutes from './modules/hemis/routes/hemis.routes.js';
import paymentRoutes from './modules/payment/routes/payment.routes.js';
import dashboardRoutes from './modules/dashboard/routes/dashboard.routes.js';
import notificationRoutes from './modules/notifications/routes/notifications.routes.js';
import fileRoutes from './modules/files/routes/files.routes.js';

import { authMiddleware } from './middleware/auth.js';
import { tenantMiddleware } from './middleware/tenant.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1', authMiddleware, tenantMiddleware);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/lms', lmsRoutes);
app.use('/api/v1/hemis', hemisRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/files', fileRoutes);

app.use(errorHandler);

export default app;
