import { Router } from 'express';
import { addLeadNote, createLead, getPipeline, listLeads } from '../controllers/crm.controller.js';

const router = Router();

router.get('/pipeline', getPipeline);
router.get('/leads', listLeads);
router.post('/leads', createLead);
router.post('/leads/:id/notes', addLeadNote);

export default router;
