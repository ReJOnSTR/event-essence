import { supabase } from "@/integrations/supabase/client";
import { GeneralSettings } from "@/types/settings";

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  defaultLessonDuration: 60
};

export const getDefaultLessonDuration = async (): Promise<number> => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('data')
      .eq('type', 'general')
      .maybeSingle();

    return (data?.data as GeneralSettings)?.defaultLessonDuration || DEFAULT_GENERAL_SETTINGS.defaultLessonDuration;
  } catch (error) {
    console.error('Error loading default lesson duration:', error);
    return DEFAULT_GENERAL_SETTINGS.defaultLessonDuration;
  }
};

export const setDefaultLessonDuration = async (minutes: number): Promise<void> => {
  const user = await supabase.auth.getUser();
  await supabase
    .from('settings')
    .upsert({
      type: 'general',
      data: { defaultLessonDuration: minutes },
      user_id: user.data.user?.id
    });
};