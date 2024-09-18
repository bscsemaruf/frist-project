import express from 'express';
import { UserControllers } from './user.controller';

import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../utils/validateRequest';
import { FacultyValidations } from '../faculty/faculty.validation';

import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.faculty),
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  // auth(USER_ROLE.faculty),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

export const UserRoutes = router;
