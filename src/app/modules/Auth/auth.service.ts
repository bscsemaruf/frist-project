import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TAuth } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

const loginUser = async (payload: TAuth) => {
  const user = await User.isUserExists(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not Exist');
  }

  // check if user is soft deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is deleted');
  }

  // check if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User is blocked');
  }

  // check enter password is correct
  console.log(user.password, user);
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is incorrect');
  }

  // token create
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });
  return { token, needsPasswordChange: user.needsPasswordChange };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExists(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not Exist');
  }

  // check if user is soft deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is deleted');
  }

  // check if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User is blocked');
  }

  // check enter password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old Password is incorrect');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      newPasswordCreatedAt: new Date(),
    },
  );
  return null;
};

export const AuthServices = {
  loginUser,
  changePassword,
};
