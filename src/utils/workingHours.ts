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
    
    return data.data as WeeklyWorkingHours || DEFAULT_WORKING_HOURS;
  } catch (error) {
    console.error('Error reading working hours:', error);
    return DEFAULT_WORKING_HOURS;
  }
};

export const setWorkingHours = async (hours: WeeklyWorkingHours): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    await supabase
      .from('settings')
      .upsert({
        type: 'working_hours',
        data: hours as any, // Using type assertion since the data is validated by our TypeScript interface
        user_id: user.data.user?.id
      });
  } catch (error) {
    console.error('Error saving working hours:', error);
  }
};