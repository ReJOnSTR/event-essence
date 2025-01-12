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
  
  // First convert to unknown, then to the correct type
  const workingHours = settings.working_hours as unknown as WeeklyWorkingHours;
  
  // Validate and merge with defaults
  return {
    monday: { ...DEFAULT_WORKING_HOURS.monday, ...workingHours.monday },
    tuesday: { ...DEFAULT_WORKING_HOURS.tuesday, ...workingHours.tuesday },
    wednesday: { ...DEFAULT_WORKING_HOURS.wednesday, ...workingHours.wednesday },
    thursday: { ...DEFAULT_WORKING_HOURS.thursday, ...workingHours.thursday },
    friday: { ...DEFAULT_WORKING_HOURS.friday, ...workingHours.friday },
    saturday: { ...DEFAULT_WORKING_HOURS.saturday, ...workingHours.saturday },
    sunday: { ...DEFAULT_WORKING_HOURS.sunday, ...workingHours.sunday },
  };
};