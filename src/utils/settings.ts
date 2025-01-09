import { useUserSettings } from "@/hooks/useUserSettings";

export const getDefaultLessonDuration = (): number => {
  const { settings } = useUserSettings();
  return settings?.default_lesson_duration || 60;
};