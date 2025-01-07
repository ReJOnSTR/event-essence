import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saveSettings, getSettings, type SettingType } from '@/services/settingsService';

export const useSettings = (type: SettingType) => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', type],
    queryFn: () => getSettings(type),
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: (data: any) => saveSettings(type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', type] });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};