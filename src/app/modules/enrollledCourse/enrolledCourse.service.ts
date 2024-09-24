/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import { startSession } from 'mongoose';

import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndGradePoints } from './enrolledCourse.utils';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;

  //   check offered course is exists
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Offered course is not found');
  }

  // check this offered course is already enrolled by this student

  const studentId = await Student.findOne({ id: userId }, { _id: 1 });

  const isOfferedCourseEnrolledAlready = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    offeredCourse,
    student: studentId?._id,
  });

  if (isOfferedCourseEnrolledAlready) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Offered Course already enrolled by this student',
    );
  }

  //   check course seat is not full yet
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Seat is not available');
  }

  // check he/she has enough credit left to enroll this course
  const studentMaxCredits = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const userTakenCredits = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: studentId?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'courseCredit',
      },
    },
    {
      $unwind: '$courseCredit',
    },
    {
      $group: {
        _id: null,
        totalCredits: { $sum: '$courseCredit.credits' },
      },
    },
    {
      $project: { totalCredits: 1 },
    },
  ]);

  // find taken new offered course

  const newCourseCredit = await Course.findById(
    isOfferedCourseExists.course,
  ).select('credits');

  if (userTakenCredits && newCourseCredit && studentMaxCredits) {
    if (
      userTakenCredits[0].totalCredits + newCourseCredit.credits >=
      studentMaxCredits.maxCredit
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'User do not have enough credit !',
      );
    }
  }
  // }

  const session = await startSession();
  try {
    session.startTransaction();
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          student: studentId?._id,
          course: isOfferedCourseExists.course,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Enrolled course can not create',
      );
    }
    const maxCapacity = isOfferedCourseExists.maxCapacity;
    console.log(maxCapacity);
    const offeredCourseCapacityUpdate = await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      { maxCapacity: maxCapacity - 1 },
      { new: true, session },
    );
    console.log(offeredCourseCapacityUpdate);
    if (!offeredCourseCapacityUpdate) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Enrolled course can not decrese seat capacity',
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration is not done',
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course is not found');
  }

  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  // check faculty is valid to this course

  const facultyId = await Faculty.findOne({ id: userId }, { _id: 1 });
  if (!facultyId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found');
  }

  const isFacultyTakenThisCourse = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: facultyId,
  });
  if (!isFacultyTakenThisCourse) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Faculty is not accesseble to this course',
    );
  }

  const modifiedMarks: Record<string, unknown> = {};

  // calculate gade and gradepoints
  if (courseMarks?.finalTerm) {
    const { firstTest, midTerm, secondTest, finalTerm } =
      isFacultyTakenThisCourse.courseMarks;
    const totalCoursMarks =
      Math.ceil(firstTest) +
      Math.ceil(midTerm) +
      Math.ceil(secondTest) +
      Math.ceil(finalTerm);
    // TODO have a issue after tow api reguest is works correctly
    const result = calculateGradeAndGradePoints(totalCoursMarks);
    modifiedMarks.grade = result.grade;
    modifiedMarks.gradePoints = result.gradePoints;
    modifiedMarks.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedMarks[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isFacultyTakenThisCourse._id,
    modifiedMarks,
    {
      new: true,
    },
  );
  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
