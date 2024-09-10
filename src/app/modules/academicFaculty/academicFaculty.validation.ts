import z from 'zod';

const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Faculty name must be needed' }),
  }),
});
const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Faculty name must be needed' }),
  }),
});

export const AcademicFacultyValidation = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
