import { Router } from 'express';
import { createLead, getPipeline } from '../controllers/crm.controller.js';

const router = Router();

router.get('/pipeline', getPipeline);
router.post('/leads', createLead);

export default router;
