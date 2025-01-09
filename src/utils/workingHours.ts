import { useUserSettings } from "@/hooks/useUserSettings";

export interface WorkingHours {
  start: string;
  end: string;
  enabled: boolean;
}

export interface WeeklyWorkingHours {
  monday: WorkingHours;
  tuesday: WorkingHours;
  wednesday: WorkingHours;
  thursday: WorkingHours;
  friday: WorkingHours;
  saturday: WorkingHours;
  sunday: WorkingHours;
}

export const DEFAULT_WORKING_HOURS: WeeklyWorkingHours = {
  monday: { start: "09:00", end: "17:00", enabled: true },
  tuesday: { start: "09:00", end: "17:00", enabled: true },
  wednesday: { start: "09:00", end: "17:00", enabled: true },
  thursday: { start: "09:00", end: "17:00", enabled: true },
  friday: { start: "09:00", end: "17:00", enabled: true },
  saturday: { start: "09:00", end: "17:00", enabled: false },
  sunday: { start: "09:00", end: "17:00", enabled: false },
};

export const getWorkingHours = (): WeeklyWorkingHours => {
  const { settings } = useUserSettings();
  if (!settings?.working_hours) return DEFAULT_WORKING_HOURS;
  
  // Tip güvenliği için kontrol ekliyoruz
  const workingHours = settings.working_hours as Record<string, WorkingHours>;
  
  // Tüm günlerin doğru formatta olduğundan emin oluyoruz
  const validatedHours: WeeklyWorkingHours = {
    monday: workingHours.monday || DEFAULT_WORKING_HOURS.monday,
    tuesday: workingHours.tuesday || DEFAULT_WORKING_HOURS.tuesday,
    wednesday: workingHours.wednesday || DEFAULT_WORKING_HOURS.wednesday,
    thursday: workingHours.thursday || DEFAULT_WORKING_HOURS.thursday,
    friday: workingHours.friday || DEFAULT_WORKING_HOURS.friday,
    saturday: workingHours.saturday || DEFAULT_WORKING_HOURS.saturday,
    sunday: workingHours.sunday || DEFAULT_WORKING_HOURS.sunday,
  };

  return validatedHours;
};