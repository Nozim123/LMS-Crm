import { Router } from 'express';
import { getOverview } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/overview', getOverview);

export default router;
