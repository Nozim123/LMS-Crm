import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/routes/auth.routes.js';
import crmRoutes from './modules/crm/routes/crm.routes.js';
import lmsRoutes from './modules/lms/routes/lms.routes.js';
import hemisRoutes from './modules/hemis/routes/hemis.routes.js';
import paymentRoutes from './modules/payment/routes/payment.routes.js';
import dashboardRoutes from './modules/dashboard/routes/dashboard.routes.js';

import { authMiddleware } from './middleware/auth.js';
import { tenantMiddleware } from './middleware/tenant.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1', authMiddleware, tenantMiddleware);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/lms', lmsRoutes);
app.use('/api/v1/hemis', hemisRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
