import { Router } from 'express';
import { addLesson, createCourse, listCourses, listLessons, submitQuizAttempt } from '../controllers/lms.controller.js';

const router = Router();

router.get('/courses', listCourses);
router.post('/courses', createCourse);
router.get('/courses/:courseId/lessons', listLessons);
router.post('/courses/:courseId/lessons', addLesson);
router.post('/quizzes/attempts', submitQuizAttempt);

export default router;
