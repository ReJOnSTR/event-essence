import { getSettings, saveSettings } from "@/services/settingsService";

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

const DEFAULT_WORKING_HOURS: WeeklyWorkingHours = {
  monday: { start: "09:00", end: "17:00", enabled: true },
  tuesday: { start: "09:00", end: "17:00", enabled: true },
  wednesday: { start: "09:00", end: "17:00", enabled: true },
  thursday: { start: "09:00", end: "17:00", enabled: true },
  friday: { start: "09:00", end: "17:00", enabled: true },
  saturday: { start: "09:00", end: "17:00", enabled: false },
  sunday: { start: "09:00", end: "17:00", enabled: false },
};

export const getWorkingHours = (): WeeklyWorkingHours => {
  try {
    const storedHours = localStorage.getItem('workingHours');
    if (storedHours) {
      return JSON.parse(storedHours);
    }
    return DEFAULT_WORKING_HOURS;
  } catch (error) {
    console.error('Error reading working hours:', error);
    return DEFAULT_WORKING_HOURS;
  }
};

export const setWorkingHours = async (hours: WeeklyWorkingHours) => {
  try {
    localStorage.setItem('workingHours', JSON.stringify(hours));
    await saveSettings('working_hours', hours);
  } catch (error) {
    console.error('Error saving working hours:', error);
  }
};

// Initialize working hours from settings
const initializeWorkingHours = async () => {
  try {
    const settings = await getSettings('working_hours');
    if (settings) {
      localStorage.setItem('workingHours', JSON.stringify(settings));
    }
  } catch (error) {
    console.error('Error initializing working hours:', error);
  }
};

// Call initialization when the module loads
initializeWorkingHours();