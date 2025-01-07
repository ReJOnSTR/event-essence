import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from '@supabase/auth-helpers-react';

type SettingType = 'working_hours' | 'holidays' | 'theme' | 'general';

interface Setting {
  id: string;
  user_id: string;
  type: SettingType;
  data: any;
  created_at: string;
  updated_at: string;
}

export function useSettings(type: SettingType) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session } = useSessionContext();

  const { data: setting, isLoading } = useQuery({
    queryKey: ['settings', type, session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('type', type)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { mutate: saveSetting } = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('settings')
        .upsert({
          type,
          data,
          user_id: session?.user.id,
        })
        .select()
        .single();

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', type] });
      toast({
        title: "Ayarlar kaydedildi",
        description: "Değişiklikleriniz başarıyla kaydedildi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  return {
    setting: setting?.data,
    isLoading,
    saveSetting,
  };
}