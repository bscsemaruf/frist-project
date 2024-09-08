import { z } from 'zod';

const userNameValidationSchema = z.object({
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

const guardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required"),
  fatherOccupation: z.string().nonempty("Father's occupation is required"),
  fatherContactNo: z.string().nonempty("Father's contact number is required"),
  motherName: z.string().nonempty("Mother's name is required"),
  motherOccupation: z.string().nonempty("Mother's occupation is required"),
  motherContactNo: z.string().nonempty("Mother's contact number is required"),
});

const localGuardianValidationSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required"),
  contactNo: z.string().nonempty("Local guardian's contact number is required"),
  address: z.string().nonempty("Local guardian's address is required"),
});

export const studentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        required_error: 'Gender is required',
      }),
      dateOfBirth: z.date().optional(),
      email: z
        .string()
        .email('Invalid email format')
        .nonempty('Email is required'),
      contactNo: z.string().nonempty('Contact number is required'),
      emergencyContactNo: z
        .string()
        .nonempty('Emergency contact number is required'),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        required_error: 'Blood group is required',
      }),
      presentAddress: z.string().nonempty('Present address is required'),
      permanentAddress: z.string().nonempty('Permanent address is required'),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImg: z.string().optional(),
    }),
  }),
});

export const StudentValidations = {
  studentValidationSchema,
};
