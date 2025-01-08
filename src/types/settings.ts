import { Json } from "@/integrations/supabase/types";
import { WeeklyWorkingHours } from "@/utils/workingHours";

export type SettingType = "working_hours" | "holidays" | "theme" | "general";

export interface BaseSetting {
  id: string;
  user_id: string;
  type: SettingType;
  created_at: string;
  updated_at: string;
}

export interface WorkingHoursSetting extends BaseSetting {
  type: "working_hours";
  data: WeeklyWorkingHours;
}

export interface HolidaysSetting extends BaseSetting {
  type: "holidays";
  data: {
    allowWorkOnHolidays: boolean;
    customHolidays: string[];
  };
}

export interface ThemeSetting extends BaseSetting {
  type: "theme";
  data: {
    theme: string;
    fontSize: string;
    fontFamily: string;
  };
}

export interface GeneralSetting extends BaseSetting {
  type: "general";
  data: {
    defaultLessonDuration: number;
  };
}

export type Settings = WorkingHoursSetting | HolidaysSetting | ThemeSetting | GeneralSetting;

export type SupabaseSetting = {
  id: string;
  user_id: string;
  type: SettingType;
  data: Json;
  created_at: string;
  updated_at: string;
};

// Type guard to ensure data is WeeklyWorkingHours
export function isWeeklyWorkingHours(data: unknown): data is WeeklyWorkingHours {
  if (typeof data !== 'object' || data === null) return false;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days.every(day => 
    data.hasOwnProperty(day) && 
    typeof (data as any)[day] === 'object' &&
    typeof (data as any)[day].start === 'string' &&
    typeof (data as any)[day].end === 'string' &&
    typeof (data as any)[day].enabled === 'boolean'
  );
}