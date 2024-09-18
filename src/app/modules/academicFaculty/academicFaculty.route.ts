import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import authValidate from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);
router.get(
  '/:facultyId',

  AcademicFacultyControllers.getSingleAcademicFaculty,
);
router.get(
  '/',
  authValidate(),
  AcademicFacultyControllers.getAllAcademicFaculty,
);
router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),

  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
