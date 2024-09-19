export const USER_ROLE = {
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
} as const;

// export type TUser_role = {
//   student: string;
//   faculty: string;
//   admin: string;
// };

export type TUser_role = keyof typeof USER_ROLE;

export const Status = ['in-progress', 'blocked'];
