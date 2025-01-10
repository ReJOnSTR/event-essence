import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';
import { useEffect } from 'react';

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

  // Kullanıcı oturumu değiştiğinde önbelleği temizle
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user settings:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No settings found for user');
      }

      const dbSettings = data as DatabaseUserSettings;
      
      const userSettings: UserSettings = {
        ...dbSettings,
        working_hours: dbSettings.working_hours as unknown as WeeklyWorkingHours,
        holidays: dbSettings.holidays as unknown as Holiday[]
      };

      return userSettings;
    },
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const dbSettings: Partial<DatabaseUserSettings> = {
        ...newSettings,
        working_hours: newSettings.working_hours as unknown as Json,
        holidays: newSettings.holidays as unknown as Json
      };

      const { data, error } = await supabase
        .from('user_settings')
        .update(dbSettings)
        .eq('user_id', userData.user.id)
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

  // Real-time güncellemeleri dinle
  useEffect(() => {
    const channel = supabase
      .channel('user_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings',
          filter: settings ? `user_id=eq.${settings.user_id}` : undefined
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['userSettings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, settings?.user_id]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
  };
};