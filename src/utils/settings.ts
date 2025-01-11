import { DEFAULT_WORKING_HOURS, WeeklyWorkingHours } from "./workingHours";

interface UserSettings {
  default_lesson_duration?: number;
  allow_work_on_holidays?: boolean;
  working_hours?: WeeklyWorkingHours;
}

export const getDefaultLessonDuration = (settings: UserSettings): number => {
  return settings?.default_lesson_duration ?? 60;
};

export const getAllowWorkOnHolidays = (settings: UserSettings): boolean => {
  return settings?.allow_work_on_holidays ?? true;
};

export const getWorkingHours = (settings: UserSettings): WeeklyWorkingHours => {
  return settings?.working_hours ?? DEFAULT_WORKING_HOURS;
};