import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    newPasswordCreatedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// if user is exist

userSchema.statics.isUserExists = async function (id) {
  return await User.findOne({ id }).select('+password');
};

// passwordCheck
userSchema.statics.isPasswordMatched = async function (
  userPassword,
  assignedPassword,
) {
  const result = await bcrypt.compare(userPassword, assignedPassword);
  return result;
};

// check for old token

userSchema.statics.isJWTIssuedChangedBeforePassword = function (
  passwordCreatedAtTimestamp,
  jwtIssuedTimestamp,
) {
  const passwordTimeChanged =
    new Date(passwordCreatedAtTimestamp).getTime() / 1000;
  return passwordTimeChanged > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
