import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  password: string;
  email: string;
  needsPasswordChange: boolean;
  newPasswordCreatedAt?: Date;
  role: 'superAdmin' | 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser>;
  isPasswordMatched(
    assignedPassword: string,
    userPassword: string,
  ): Promise<boolean>;

  isJWTIssuedChangedBeforePassword(
    passwordCreatedAtTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
