import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.offeredCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

export const OfferedCourseRoutes = router;
