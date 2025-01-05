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
    const stored = localStorage.getItem('workingHours');
    if (!stored) {
      // If no working hours are stored, save the defaults
      localStorage.setItem('workingHours', JSON.stringify(DEFAULT_WORKING_HOURS));
      return DEFAULT_WORKING_HOURS;
    }
    
    const parsed = JSON.parse(stored);
    // Ensure all days are present with default values
    const hours = {
      ...DEFAULT_WORKING_HOURS,
      ...parsed
    };
    
    // Update storage with complete hours object
    localStorage.setItem('workingHours', JSON.stringify(hours));
    return hours;
  } catch (error) {
    console.error('Error reading working hours from localStorage:', error);
    return DEFAULT_WORKING_HOURS;
  }
};

export const setWorkingHours = (hours: WeeklyWorkingHours): void => {
  try {
    // Ensure we're saving a complete hours object
    const completeHours = {
      ...DEFAULT_WORKING_HOURS,
      ...hours
    };
    localStorage.setItem('workingHours', JSON.stringify(completeHours));
  } catch (error) {
    console.error('Error saving working hours to localStorage:', error);
  }
};