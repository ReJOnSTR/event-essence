import { useUserSettings } from './useUserSettings';
import { WeeklyWorkingHours } from '@/types/calendar';

export const useWorkingHours = () => {
  const { settings, isLoading, updateSettings } = useUserSettings();
  
  const defaultHours: WeeklyWorkingHours = {
    monday: { start: "09:00", end: "17:00", enabled: true },
    tuesday: { start: "09:00", end: "17:00", enabled: true },
    wednesday: { start: "09:00", end: "17:00", enabled: true },
    thursday: { start: "09:00", end: "17:00", enabled: true },
    friday: { start: "09:00", end: "17:00", enabled: true },
    saturday: { start: "09:00", end: "17:00", enabled: false },
    sunday: { start: "09:00", end: "17:00", enabled: false },
  };

  const workingHours = settings?.working_hours || defaultHours;

  const updateWorkingHours = (newHours: WeeklyWorkingHours) => {
    updateSettings.mutate({ working_hours: newHours });
  };

  const checkWorkingHours = (date: Date, hour: number) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = workingHours[days[date.getDay()]];
    
    if (!daySettings.enabled) return false;
    
    const [startHour] = daySettings.start.split(':').map(Number);
    const [endHour] = daySettings.end.split(':').map(Number);
    
    return hour >= startHour && hour < endHour;
  };

  return {
    workingHours,
    isLoading,
    updateWorkingHours,
    checkWorkingHours,
  };
};