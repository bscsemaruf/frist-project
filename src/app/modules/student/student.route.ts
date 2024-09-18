import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../utils/validateRequest';
import { StudentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/:studentId', StudentControllers.getSingleStudent);
router.get(
  '/',
  auth(USER_ROLE.faculty, USER_ROLE.student),
  StudentControllers.getAllStudents,
);

router.patch(
  '/:studentId',
  validateRequest(StudentValidations.updateCreateStudentValidationSchema),
  StudentControllers.updateStudent,
);
router.delete('/:studentId', StudentControllers.deleteStudent);

export const StudentRoutes = router;
