import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, 'First name should be within 20 characters')
    .regex(
      /^[A-Z][a-z]*$/,
      'First name must be capitalized and contain only letters',
    )
    .nonempty('First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().nonempty('Last name is required'),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required"),
  fatherOccupation: z.string().nonempty("Father's occupation is required"),
  fatherContactNo: z.string().nonempty("Father's contact number is required"),
  motherName: z.string().nonempty("Mother's name is required"),
  motherOccupation: z.string().nonempty("Mother's occupation is required"),
  motherContactNo: z.string().nonempty("Mother's contact number is required"),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required"),
  contactNo: z.string().nonempty("Local guardian's contact number is required"),
  address: z.string().nonempty("Local guardian's address is required"),
});

export const createFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        required_error: 'Gender is required',
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email('Invalid email format')
        .nonempty('Email is required'),
      contactNo: z.string().nonempty('Contact number is required'),
      designation: z.string({ required_error: 'Designation is required' }),
      emergencyContactNo: z
        .string()
        .nonempty('Emergency contact number is required'),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        required_error: 'Blood group is required',
      }),
      presentAddress: z.string().nonempty('Present address is required'),
      permanentAddress: z.string().nonempty('Permanent address is required'),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      academicDepartment: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

// update

const updateCreateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, 'First name should be within 20 characters')
    .regex(
      /^[A-Z][a-z]*$/,
      'First name must be capitalized and contain only letters',
    )
    .nonempty('First name is required')
    .optional(),
  middleName: z.string().optional(),
  lastName: z.string().nonempty('Last name is required').optional(),
});

const updateCreateGuardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required").optional(),
  fatherOccupation: z
    .string()
    .nonempty("Father's occupation is required")
    .optional(),
  fatherContactNo: z
    .string()
    .nonempty("Father's contact number is required")
    .optional(),
  motherName: z.string().nonempty("Mother's name is required").optional(),
  motherOccupation: z
    .string()
    .nonempty("Mother's occupation is required")
    .optional(),
  motherContactNo: z
    .string()
    .nonempty("Mother's contact number is required")
    .optional(),
});

const updateCreateLocalGuardianValidationSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required").optional(),
  contactNo: z
    .string()
    .nonempty("Local guardian's contact number is required")
    .optional(),
  address: z
    .string()
    .nonempty("Local guardian's address is required")
    .optional(),
});

export const updateCreateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: updateCreateUserNameValidationSchema.optional(),
      gender: z
        .enum(['male', 'female', 'other'], {
          required_error: 'Gender is required',
        })
        .optional(),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email('Invalid email format')
        .nonempty('Email is required')
        .optional(),
      contactNo: z.string().nonempty('Contact number is required').optional(),
      designation: z
        .string({ required_error: 'Designation is required' })
        .optional(),
      emergencyContactNo: z
        .string()
        .nonempty('Emergency contact number is required')
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
          required_error: 'Blood group is required',
        })
        .optional(),
      presentAddress: z
        .string()
        .nonempty('Present address is required')
        .optional(),
      permanentAddress: z
        .string()
        .nonempty('Permanent address is required')
        .optional(),
      guardian: updateCreateGuardianValidationSchema.optional(),
      localGuardian: updateCreateLocalGuardianValidationSchema.optional(),
      academicDepartment: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const FacultyValidations = {
  createFacultyValidationSchema,
  updateCreateFacultyValidationSchema,
};
