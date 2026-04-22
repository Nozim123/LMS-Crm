import { Router } from 'express';
import { listCourses, submitHomework } from '../controllers/lms.controller.js';

const router = Router();

router.get('/courses', listCourses);
router.post('/homework/submissions', submitHomework);

export default router;
