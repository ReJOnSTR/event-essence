import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { SettingType, SettingsData } from '@/types/settings';

export function useSettings<T>(type: SettingType) {
  const [setting, setSetting] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSetting();
  }, [type]);

  const loadSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('data')
        .eq('type', type)
        .maybeSingle();

      if (error) throw error;
      setSetting(data?.data as T || null);
    } catch (error: any) {
      console.error(`Error loading ${type} settings:`, error);
      toast({
        title: "Hata",
        description: `Ayarlar yüklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (data: T) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          type,
          data: data as any,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      setSetting(data);
      toast({
        title: "Başarılı",
        description: "Ayarlar başarıyla kaydedildi.",
      });
    } catch (error: any) {
      console.error(`Error saving ${type} settings:`, error);
      toast({
        title: "Hata",
        description: `Ayarlar kaydedilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return { setting, saveSetting, isLoading };
}