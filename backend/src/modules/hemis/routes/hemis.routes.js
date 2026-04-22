import { Router } from 'express';
import { calculateGpa, getAttendance } from '../controllers/hemis.controller.js';

const router = Router();

router.get('/attendance', getAttendance);
router.get('/students/:studentId/gpa', calculateGpa);

export default router;
