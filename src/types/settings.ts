export interface WorkingHoursDay {
  start: string;
  end: string;
  enabled: boolean;
}

export interface WeeklyWorkingHours {
  monday: WorkingHoursDay;
  tuesday: WorkingHoursDay;
  wednesday: WorkingHoursDay;
  thursday: WorkingHoursDay;
  friday: WorkingHoursDay;
  saturday: WorkingHoursDay;
  sunday: WorkingHoursDay;
}

export interface ThemeSettings {
  theme: string;
  fontSize: string;
  fontFamily: string;
}

export interface HolidaySettings {
  selectedDates: string[];
  allowWorkOnHolidays: boolean;
}

export interface GeneralSettings {
  defaultLessonDuration: number;
}

export type SettingType = 'working_hours' | 'holidays' | 'theme' | 'general';

export type SettingsData = 
  | { type: 'working_hours'; data: WeeklyWorkingHours }
  | { type: 'holidays'; data: HolidaySettings }
  | { type: 'theme'; data: ThemeSettings }
  | { type: 'general'; data: GeneralSettings };