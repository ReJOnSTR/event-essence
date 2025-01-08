import { WeeklyWorkingHours } from "@/utils/workingHours";
import { Json } from "@/integrations/supabase/types";

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