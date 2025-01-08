import { WeeklyWorkingHours } from "./workingHours";

export const settingsStorage = {
  getWorkingHours: (): WeeklyWorkingHours | null => {
    try {
      const stored = localStorage.getItem('workingHours');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setWorkingHours: (hours: WeeklyWorkingHours): void => {
    localStorage.setItem('workingHours', JSON.stringify(hours));
  },

  getAllowWorkOnHolidays: (): boolean => {
    return localStorage.getItem('allowWorkOnHolidays') === 'true';
  },

  setAllowWorkOnHolidays: (allow: boolean): void => {
    localStorage.setItem('allowWorkOnHolidays', allow.toString());
  },

  getHolidays: (): string[] => {
    try {
      const stored = localStorage.getItem('holidays');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setHolidays: (holidays: string[]): void => {
    localStorage.setItem('holidays', JSON.stringify(holidays));
  },

  getTheme: () => ({
    theme: localStorage.getItem('theme') || 'light',
    fontSize: localStorage.getItem('fontSize') || 'medium',
    fontFamily: localStorage.getItem('fontFamily') || 'system',
  }),

  setTheme: (theme: { theme: string; fontSize: string; fontFamily: string }): void => {
    localStorage.setItem('theme', theme.theme);
    localStorage.setItem('fontSize', theme.fontSize);
    localStorage.setItem('fontFamily', theme.fontFamily);
  },
};