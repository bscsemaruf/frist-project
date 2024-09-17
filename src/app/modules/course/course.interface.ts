import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};
export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  isDeleted?: false;
  preRequisiteCourses: [TPreRequisiteCourses];
};

export type TCourseFaculties = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
