import { Router } from 'express';
import { createCourse, listCourses, submitQuizAttempt } from '../controllers/lms.controller.js';

const router = Router();

router.get('/courses', listCourses);
router.post('/courses', createCourse);
router.post('/quizzes/attempts', submitQuizAttempt);

export default router;
