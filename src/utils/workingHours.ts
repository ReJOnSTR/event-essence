import { supabase } from "@/integrations/supabase/client";
import { WeeklyWorkingHours, WorkingHoursDay } from "@/types/settings";

const DEFAULT_DAY: WorkingHoursDay = {
  start: "09:00",
  end: "17:00",
  enabled: true
};

export const DEFAULT_WORKING_HOURS: WeeklyWorkingHours = {
  monday: { ...DEFAULT_DAY },
  tuesday: { ...DEFAULT_DAY },
  wednesday: { ...DEFAULT_DAY },
  thursday: { ...DEFAULT_DAY },
  friday: { ...DEFAULT_DAY },
  saturday: { ...DEFAULT_DAY, enabled: false },
  sunday: { ...DEFAULT_DAY, enabled: false },
};

export const getWorkingHours = async (): Promise<WeeklyWorkingHours> => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('data')
      .eq('type', 'working_hours')
      .maybeSingle();

    if (!data?.data) return DEFAULT_WORKING_HOURS;
    
    return data.data as WeeklyWorkingHours;
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
        data: hours,
        user_id: user.data.user?.id
      });
  } catch (error) {
    console.error('Error saving working hours:', error);
    throw error;
  }
};