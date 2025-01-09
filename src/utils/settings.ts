import { useWorkingHours } from "@/hooks/useWorkingHours";

export const getDefaultLessonDuration = (): number => {
  const { defaultLessonDuration } = useWorkingHours();
  return defaultLessonDuration || 60;
};

export const getDefaultStartHour = (): number => {
  const { workingHours } = useWorkingHours();
  if (!workingHours?.monday) return 9;
  
  const [startHour] = workingHours.monday.start.split(':').map(Number);
  return startHour || 9;
};