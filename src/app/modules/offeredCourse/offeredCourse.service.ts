import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import { SemesterStatus } from '../semesterRegistration/semesterRegistration.constant';
import { Student } from '../student/student.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  // if the registration id is exists
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found',
    );
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  // if the academic faculty id is exists
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty is not found');
  }

  // if the academic department id is exists
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department is not found',
    );
  }

  // if course id is exists
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found');
  }

  // if faculty id is exists
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found');
  }

  //   check academic department is under acadeic faculty?

  const isDepartmentUnderExistsIntoFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentUnderExistsIntoFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This ${isAcademicDepartmentExists.name} is not under this ${isAcademicFacultyExists.name}`,
    );
  }

  //   check same semester registered course is on a section for one time

  const isSemesterRegistrationWithThisCourseHasSelectedSection =
    await OfferedCourse.findOne({ semesterRegistration, course, section });

  if (isSemesterRegistrationWithThisCourseHasSelectedSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Already  ${isCourseExists.title} is running into  section ${section}`,
    );
  }

  //   find out faculties time into this same registration field

  const existingSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  const timeConflict = hasTimeConflict(existingSchedules, newSchedule);
  if (timeConflict) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at this time, You can change date or time`,
    );
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getMyOfferedCourses = async (userId: string) => {
  const student = await Student.findOne({ id: userId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  // find ongoing semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'There is no ongoing semester now!',
    );
  }

  const result = await OfferedCourse.aggregate([
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'courseList',
      },
    },
    {
      $unwind: '$courseList',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },

        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
  ]);

  return result;
};

const deleteOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isExistsIntoOfferedCourse = await OfferedCourse.findById(id);
  if (!isExistsIntoOfferedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course is not found');
  }

  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    isExistsIntoOfferedCourse.semesterRegistration,
  );

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration is not found',
    );
  }

  if (isSemesterRegistrationExists?.status !== SemesterStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isSemesterRegistrationExists?.status} semester can not update`,
    );
  }

  const isFacultyExists = await Faculty.findById(payload.faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found');
  }

  const existingSchedules = await OfferedCourse.find({
    _id: id,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(existingSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Faculty is not available this time, You should change time or date',
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getMyOfferedCourses,
  deleteOfferedCourseIntoDB,
};
