import { Router } from 'express';
import { calculateGpa, listStudents, markAttendance } from '../controllers/hemis.controller.js';

const router = Router();

router.get('/students', listStudents);
router.get('/students/:studentId/gpa', calculateGpa);
router.post('/attendance', markAttendance);

export default router;
