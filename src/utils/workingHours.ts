export interface DaySettings {
  enabled: boolean;
  start: string;
  end: string;
}

export interface WeeklyWorkingHours {
  monday: DaySettings;
  tuesday: DaySettings;
  wednesday: DaySettings;
  thursday: DaySettings;
  friday: DaySettings;
  saturday: DaySettings;
  sunday: DaySettings;
}

const DEFAULT_WORKING_HOURS: WeeklyWorkingHours = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: false, start: "09:00", end: "17:00" },
  sunday: { enabled: false, start: "09:00", end: "17:00" }
};

export const getWorkingHours = (): WeeklyWorkingHours => {
  try {
    const savedHours = localStorage.getItem('workingHours');
    if (!savedHours) {
      setWorkingHours(DEFAULT_WORKING_HOURS);
      return DEFAULT_WORKING_HOURS;
    }
    const parsedHours = JSON.parse(savedHours) as WeeklyWorkingHours;
    return {
      ...DEFAULT_WORKING_HOURS,
      ...parsedHours
    };
  } catch (error) {
    console.error('Error reading working hours:', error);
    return DEFAULT_WORKING_HOURS;
  }
};

export const setWorkingHours = (hours: WeeklyWorkingHours): void => {
  try {
    localStorage.setItem('workingHours', JSON.stringify(hours));
  } catch (error) {
    console.error('Error saving working hours:', error);
  }
};