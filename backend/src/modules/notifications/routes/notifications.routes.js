import { Router } from 'express';
import { sendNotification } from '../controllers/notifications.controller.js';

const router = Router();
router.post('/', sendNotification);
export default router;
