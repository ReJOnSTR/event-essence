import { WeeklyWorkingHours } from "@/utils/workingHours";

export type SettingType = "working_hours" | "holidays" | "theme" | "general";

export interface Setting {
  id: string;
  user_id: string;
  type: SettingType;
  data: any;
  created_at: string;
  updated_at: string;
}

export interface WorkingHoursSetting extends Setting {
  type: "working_hours";
  data: WeeklyWorkingHours;
}

export interface HolidaysSetting extends Setting {
  type: "holidays";
  data: {
    allowWorkOnHolidays: boolean;
    customHolidays: string[];
  };
}

export interface ThemeSetting extends Setting {
  type: "theme";
  data: {
    theme: string;
    fontSize: string;
    fontFamily: string;
  };
}

export interface GeneralSetting extends Setting {
  type: "general";
  data: {
    defaultLessonDuration: number;
  };
}

export type Settings = WorkingHoursSetting | HolidaysSetting | ThemeSetting | GeneralSetting;