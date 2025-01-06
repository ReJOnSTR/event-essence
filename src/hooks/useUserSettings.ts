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

type SupabaseUserSettings = Omit<UserSettings, 'working_hours'> & {
  working_hours: unknown;
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
        .single();

      if (error) throw error;
      
      // Convert the unknown working_hours to our expected type
      const supabaseData = data as SupabaseUserSettings;
      const workingHours = supabaseData.working_hours as WeeklyWorkingHours;

      return {
        ...supabaseData,
        working_hours: workingHours
      } as UserSettings;
    },
    enabled: !!session?.user.id,
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      // Convert the settings to a format Supabase expects
      const supabaseSettings = {
        ...newSettings,
        working_hours: newSettings.working_hours as unknown
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