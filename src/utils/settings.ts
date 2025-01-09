import { useUserSettings } from "@/hooks/useUserSettings";

export const getDefaultLessonDuration = (): number => {
  const { settings } = useUserSettings();
  return settings?.default_lesson_duration || 60;
};

export const getAllowWorkOnHolidays = (): boolean => {
  const { settings } = useUserSettings();
  return settings?.allow_work_on_holidays ?? true;
};