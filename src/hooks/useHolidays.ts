import { useUserSettings } from './useUserSettings';
import { useToast } from '@/components/ui/use-toast';

export const useHolidays = () => {
  const { settings, updateSettings } = useUserSettings();
  const { toast } = useToast();

  const addHoliday = async (date: Date, description: string) => {
    if (!settings) return;

    const newHolidays = [
      ...settings.holidays,
      {
        date: date.toISOString(),
        description
      }
    ];

    await updateSettings.mutateAsync({
      holidays: newHolidays
    });

    toast({
      title: "Tatil günü eklendi",
      description: "Yeni tatil günü başarıyla eklendi.",
    });
  };

  const removeHoliday = async (date: string) => {
    if (!settings) return;

    const newHolidays = settings.holidays.filter(
      holiday => holiday.date !== date
    );

    await updateSettings.mutateAsync({
      holidays: newHolidays
    });

    toast({
      title: "Tatil günü kaldırıldı",
      description: "Tatil günü başarıyla kaldırıldı.",
    });
  };

  const updateAllowWorkOnHolidays = async (allow: boolean) => {
    if (!settings) return;

    await updateSettings.mutateAsync({
      allow_work_on_holidays: allow
    });

    toast({
      title: "Ayar güncellendi",
      description: allow 
        ? "Tatil günlerinde çalışmaya izin verilecek" 
        : "Tatil günlerinde çalışma kapatıldı",
    });
  };

  return {
    holidays: settings?.holidays || [],
    allowWorkOnHolidays: settings?.allow_work_on_holidays,
    addHoliday,
    removeHoliday,
    updateAllowWorkOnHolidays,
    isLoading: !settings
  };
};