import { useUserSettings } from "@/hooks/useUserSettings";

export const getDefaultLessonDuration = (): number => {
  const { settings } = useUserSettings();
  return settings?.default_lesson_duration || 60;
};

export const getDefaultStartHour = (): number => {
  const { settings } = useUserSettings();
  if (!settings?.working_hours?.monday) return 9;
  
  const [startHour] = settings.working_hours.monday.start.split(':').map(Number);
  return startHour || 9;
};

// Since we're using Supabase for settings, we don't need a local setDefaultLessonDuration
// Instead, we'll update it through the useUserSettings hook