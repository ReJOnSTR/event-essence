import { getWorkingHours } from "./workingHours";

export const isDayEnabled = (date: Date): boolean => {
  const workingHours = getWorkingHours();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayName = days[date.getDay()];
  return workingHours[dayName]?.enabled ?? false;
};