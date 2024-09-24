import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../utils/validateRequest';
import { FacultyValidations } from '../faculty/faculty.validation';
import auth from '../../middlewares/auth';
import multer from 'multer';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/create-student',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.superAdmin),
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  auth(USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.get('/me', auth('admin', 'faculty', 'student'), UserControllers.getMe);

router.post('/change-status/:id', UserControllers.changeStatus);

export const UserRoutes = router;
