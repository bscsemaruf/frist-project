import { z } from 'zod';

const preRequisiteCourses = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    isDeleted: z.boolean().optional(),
    preRequisiteCourses: z.array(preRequisiteCourses).optional(),
  }),
});
const updateCourseValidatonSchema = createCourseValidationSchema.partial();

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidatonSchema,
};
