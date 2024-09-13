import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/:id', CourseControllers.getSingleCourse);

router.get('/', CourseControllers.getAllCourses);

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidatonSchema),
  CourseControllers.updateCourse,
);

router.patch('/:id', CourseControllers.deleteCourse);

export const CourseRoutes = router;
