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
  
  if (!settings?.working_hours) {
    return DEFAULT_WORKING_HOURS;
  }

  const userWorkingHours = settings.working_hours as unknown as WeeklyWorkingHours;

  return {
    monday: { ...DEFAULT_WORKING_HOURS.monday, ...userWorkingHours.monday },
    tuesday: { ...DEFAULT_WORKING_HOURS.tuesday, ...userWorkingHours.tuesday },
    wednesday: { ...DEFAULT_WORKING_HOURS.wednesday, ...userWorkingHours.wednesday },
    thursday: { ...DEFAULT_WORKING_HOURS.thursday, ...userWorkingHours.thursday },
    friday: { ...DEFAULT_WORKING_HOURS.friday, ...userWorkingHours.friday },
    saturday: { ...DEFAULT_WORKING_HOURS.saturday, ...userWorkingHours.saturday },
    sunday: { ...DEFAULT_WORKING_HOURS.sunday, ...userWorkingHours.sunday },
  };
};