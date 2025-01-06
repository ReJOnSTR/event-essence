export interface WorkingHours {
  start: string;
  end: string;
  enabled: boolean;
}

export interface WeeklyWorkingHours {
  [key: string]: WorkingHours;
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
    const stored = localStorage.getItem('workingHours');
    if (!stored) return DEFAULT_WORKING_HOURS;
    
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_WORKING_HOURS,
      ...parsed
    } as WeeklyWorkingHours;
  } catch (error) {
    console.error('Error reading working hours from localStorage:', error);
    return DEFAULT_WORKING_HOURS;
  }
};

export const setWorkingHours = (hours: WeeklyWorkingHours): void => {
  try {
    localStorage.setItem('workingHours', JSON.stringify(hours));
  } catch (error) {
    console.error('Error saving working hours to localStorage:', error);
  }
};