import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check if client sent token
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized person',
      );
    }

    // check if token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { userId, role, iat } = decoded;

    const user = await User.isUserExists(userId);
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

    if (
      user.newPasswordCreatedAt &&
      User.isJWTIssuedChangedBeforePassword(
        user.newPasswordCreatedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized person',
      );
    }
    if (requiredRoles && !requiredRoles?.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized person',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
