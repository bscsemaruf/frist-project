import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../utils/validateRequest';
import { StudentValidations } from './student.validation';

const router = express.Router();

router.get('/:studentId', StudentControllers.getSingleStudent);
router.get('/', StudentControllers.getAllStudents);
router.patch(
  '/:studentId',
  validateRequest(StudentValidations.updateCreateStudentValidationSchema),
  StudentControllers.updateStudent,
);
router.delete('/:studentId', StudentControllers.deleteStudent);

export const StudentRoutes = router;
