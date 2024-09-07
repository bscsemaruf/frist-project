import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //   const zodParsedData = studentValidationSchema.parse(studentData);
  const user: Partial<TUser> = {};
  user.password = password || (config.default_pass as string);
  //  create a custom  role
  user.role = 'student';
  //   create a custom id
  user.id = '2030100002';

  const newUser = await User.create(user);
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;

    studentData.user = newUser._id;
    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
