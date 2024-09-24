import { Types } from 'mongoose';

export type TGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'NA';
export type TEnrolledCourseMarks = {
  firstTest: number;
  midTerm: number;
  secondTest: number;
  finalTerm: number;
};
export type TEnrolledCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  student: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  isEnrolled: boolean;
  grade: TGrade;
  courseMarks: TEnrolledCourseMarks;
  gradePoints: number;
  isCompleted: boolean;
};
