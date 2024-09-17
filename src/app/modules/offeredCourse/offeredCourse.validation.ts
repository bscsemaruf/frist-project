import { z } from 'zod';
import { Days } from './offeredCourse.constant';

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
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format. Expected hh:mm',
        },
      ),
      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format, plz follow HH:MM format',
        },
      ),
    })
    .refine(
      (body) => {
        const start = `2002-01-23T${body.startTime}`;
        const end = `2002-01-23T${body.endTime}`;

        return end > start;
      },
      {
        message: 'End time should be after Start time',
      },
    ),
});

export const OfferedCourseValidations = {
  offeredCourseValidationSchema,
};
