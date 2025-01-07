import { supabase } from "@/integrations/supabase/client";

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

export const getWorkingHours = async (): Promise<WeeklyWorkingHours> => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('data')
      .eq('type', 'working_hours')
      .maybeSingle();

    if (!data) return DEFAULT_WORKING_HOURS;
    
    return {
      ...DEFAULT_WORKING_HOURS,
      ...data.data
    };
  } catch (error) {
    console.error('Error reading working hours:', error);
    return DEFAULT_WORKING_HOURS;
  }
};

export const setWorkingHours = async (hours: WeeklyWorkingHours): Promise<void> => {
  try {
    await supabase
      .from('settings')
      .upsert({
        type: 'working_hours',
        data: hours,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
  } catch (error) {
    console.error('Error saving working hours:', error);
  }
};