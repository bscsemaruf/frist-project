import z from 'zod';
import { Status } from './user.constant';

const userValidationSchema = z.object({
  password: z
    .string()
    .max(20, { message: 'password can not more than 20 characters' })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...Status] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};
