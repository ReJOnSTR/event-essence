import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type SettingType = 'theme' | 'working_hours' | 'holidays' | 'font' | 'lesson_duration';

interface Setting {
  id: string;
  user_id: string;
  type: SettingType;
  data: any;
  created_at: string;
  updated_at: string;
}

export const saveSettings = async (type: SettingType, data: any) => {
  try {
    const { data: existingSetting, error: fetchError } = await supabase
      .from('settings')
      .select()
      .eq('type', type)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (existingSetting) {
      const { error } = await supabase
        .from('settings')
        .update({ data })
        .eq('id', existingSetting.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('settings')
        .insert([{ type, data }]);

      if (error) throw error;
    }

    toast({
      title: "Ayarlar kaydedildi",
      description: "Ayarlarınız başarıyla güncellendi.",
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    toast({
      title: "Hata",
      description: "Ayarlar kaydedilirken bir hata oluştu.",
      variant: "destructive",
    });
  }
};

export const getSettings = async (type: SettingType): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select()
      .eq('type', type)
      .maybeSingle();

    if (error) throw error;

    return data?.data || null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};