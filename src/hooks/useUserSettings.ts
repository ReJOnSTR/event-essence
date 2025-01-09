import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

interface UserSettings {
  id: string;
  user_id: string;
  default_lesson_duration: number;
  working_hours: WeeklyWorkingHours;
  holidays: Array<{ date: string; description: string }>;
  allow_work_on_holidays: boolean;
  theme: string;
  font_size: string;
  font_family: string;
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

      return data as UserSettings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      const { data, error } = await supabase
        .from('user_settings')
        .update(newSettings)
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
    updateSettings: (newSettings: Partial<UserSettings>) => 
      updateSettings.mutate(newSettings),
  };
};