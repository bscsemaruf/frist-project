import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedule: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedule) {
    const existingStart = new Date(`2002-01-23T${schedule.startTime}`);
    const existingEnd = new Date(`2002-01-23T${schedule.endTime}`);
    const newStartTime = new Date(`2002-01-23T${newSchedule.startTime}`);
    const newEndTime = new Date(`2002-01-23T${newSchedule.endTime}`);
    if (newStartTime < existingEnd && newEndTime > existingStart) {
      return true;
    }
  }
  return false;
};
