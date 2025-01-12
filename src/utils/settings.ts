import { useUserSettings } from "@/hooks/useUserSettings";

export const getDefaultLessonDuration = (): number => {
  const { settings } = useUserSettings();
  // Ayarlar yüklenene kadar varsayılan değeri kullanıyoruz
  if (!settings) return 60;
  return settings.default_lesson_duration;
};

export const getAllowWorkOnHolidays = (): boolean => {
  const { settings } = useUserSettings();
  // Ayarlar yüklenene kadar varsayılan değeri kullanıyoruz
  if (!settings) return true;
  return settings.allow_work_on_holidays;
};