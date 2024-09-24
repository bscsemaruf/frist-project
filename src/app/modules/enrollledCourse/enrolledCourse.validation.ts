import { z } from 'zod';

const enrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string({ required_error: 'offered course is required' }),
  }),
});

const updateEnrolledCourseMarksValidation = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      firstTest: z.number().optional(),
      mid: z.number().optional(),
      sencondTest: z.number().optional(),
      finalTerm: z.number().optional(),
    }),
  }),
});

export const EnrolledCourseValidations = {
  enrolledCourseValidationSchema,
  updateEnrolledCourseMarksValidation,
};
