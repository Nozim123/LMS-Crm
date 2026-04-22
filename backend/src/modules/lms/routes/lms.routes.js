import { Router } from 'express';
import {
  addChapter,
  addLesson,
  courseDetails,
  createCourse,
  listCourses,
  listLessons,
  submitQuizAttempt,
  toggleLessonCompletion
} from '../controllers/lms.controller.js';

const router = Router();

router.get('/courses', listCourses);
router.post('/courses', createCourse);
router.get('/courses/:courseId/detail', courseDetails);
router.get('/courses/:courseId/lessons', listLessons);
router.post('/courses/:courseId/lessons', addLesson);
router.post('/courses/:courseId/chapters', addChapter);
router.post('/lessons/:lessonId/progress', toggleLessonCompletion);
router.post('/quizzes/attempts', submitQuizAttempt);

export default router;
