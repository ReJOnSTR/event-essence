import { supabase } from "@/integrations/supabase/client";

export const getDefaultLessonDuration = async (): Promise<number> => {
  const { data } = await supabase
    .from('settings')
    .select('data')
    .eq('type', 'general')
    .maybeSingle();

  return data?.data?.defaultLessonDuration || 60;
};

export const setDefaultLessonDuration = async (minutes: number): Promise<void> => {
  await supabase
    .from('settings')
    .upsert({
      type: 'general',
      data: { defaultLessonDuration: minutes },
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
};