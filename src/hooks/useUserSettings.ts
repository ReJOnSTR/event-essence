import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

interface WorkingHours {
  start: string;
  end: string;
  enabled: boolean;
}

interface WeeklyWorkingHours {
  monday: WorkingHours;
  tuesday: WorkingHours;
  wednesday: WorkingHours;
  thursday: WorkingHours;
  friday: WorkingHours;
  saturday: WorkingHours;
  sunday: WorkingHours;
}

interface Holiday {
  date: string;
  description: string;
}

interface UserSettings {
  id: string;
  user_id: string;
  default_lesson_duration: number;
  working_hours: WeeklyWorkingHours;
  holidays: Holiday[];
  allow_work_on_holidays: boolean;
  theme: string;
  font_size: string;
  font_family: string;
  created_at?: string;
  updated_at?: string;
}

interface DatabaseUserSettings {
  id: string;
  user_id: string;
  default_lesson_duration: number;
  working_hours: Json;
  holidays: Json;
  allow_work_on_holidays: boolean;
  theme: string;
  font_size: string;
  font_family: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching user settings:', error);
        throw error;
      }

      const dbSettings = data as DatabaseUserSettings;
      
      const userSettings: UserSettings = {
        ...dbSettings,
        working_hours: dbSettings.working_hours as unknown as WeeklyWorkingHours,
        holidays: dbSettings.holidays as unknown as Holiday[]
      };

      return userSettings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      const dbSettings: Partial<DatabaseUserSettings> = {
        ...newSettings,
        working_hours: newSettings.working_hours as unknown as Json,
        holidays: newSettings.holidays as unknown as Json
      };

      const { data, error } = await supabase
        .from('user_settings')
        .update(dbSettings)
        .eq('user_id', settings?.user_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user settings:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast({
        title: "Ayarlar güncellendi",
        description: "Değişiklikleriniz başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      console.error('Error in updateSettings mutation:', error);
      toast({
        title: "Hata",
        description: "Ayarlar güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings,
  };
};