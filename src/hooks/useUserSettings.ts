import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { WeeklyWorkingHours } from "@/utils/workingHours";

interface UserSettings {
  id: string;
  user_id: string;
  font_size: string;
  font_family: string;
  theme: string;
  default_lesson_duration: number;
  working_hours: WeeklyWorkingHours;
}

// Type for data that Supabase returns
type SupabaseUserSettings = Omit<UserSettings, 'working_hours'> & {
  working_hours: Record<string, any>;
};

// Type for data that Supabase accepts
type SupabaseData = {
  created_at?: string;
  default_lesson_duration?: number;
  font_family?: string;
  font_size?: string;
  id?: string;
  theme?: string;
  updated_at?: string;
  user_id?: string;
  working_hours?: Record<string, any>;
};

export const useUserSettings = () => {
  const { session } = useSessionContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['userSettings', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session?.user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      // Convert the Supabase data to our expected type
      const supabaseData = data as SupabaseUserSettings;
      return {
        ...supabaseData,
        working_hours: supabaseData.working_hours as WeeklyWorkingHours
      } as UserSettings;
    },
    enabled: !!session?.user.id,
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      // Convert the settings to a format Supabase expects
      const supabaseSettings: SupabaseData = {
        ...newSettings,
        working_hours: newSettings.working_hours as Record<string, any>
      };

      const { error } = await supabase
        .from('user_settings')
        .update(supabaseSettings)
        .eq('user_id', session?.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast({
        title: "Ayarlar güncellendi",
        description: "Ayarlarınız başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};