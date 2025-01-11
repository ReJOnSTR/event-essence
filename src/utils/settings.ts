import { DEFAULT_WORKING_HOURS } from "./workingHours";

export const getDefaultLessonDuration = (settings: any): number => {
  return settings?.default_lesson_duration ?? 60;
};

export const getAllowWorkOnHolidays = (settings: any): boolean => {
  return settings?.allow_work_on_holidays ?? true;
};

export const getWorkingHours = (settings: any) => {
  return settings?.working_hours ?? DEFAULT_WORKING_HOURS;
};