import express from 'express';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import validateRequest from '../../utils/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.semesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
