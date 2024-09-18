import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const setTime = z.string().refine(
  (time) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  },
  {
    message: 'Invalid time format. Expected hh:mm',
  },
);

const offeredCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: setTime,
      endTime: setTime,
    })
    .refine(
      (body) => {
        const start = new Date(`2002-01-23T${body.startTime}:00`);
        const end = new Date(`2002-01-23T${body.endTime}:00`);

        return end > start;
      },
      {
        message: 'End time should be after Start time',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: setTime,
      endTime: setTime,
    })
    .refine(
      (body) => {
        const start = new Date(`2002-01-23T${body.startTime}:00`);
        const end = new Date(`2002-01-23T${body.endTime}:00`);

        return end > start;
      },
      {
        message: 'End time should be after Start time',
      },
    ),
});

export const OfferedCourseValidations = {
  offeredCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
