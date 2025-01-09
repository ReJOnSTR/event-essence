import { useUserSettings } from './useUserSettings';
import { useToast } from '@/components/ui/use-toast';
import { isHoliday } from '@/utils/turkishHolidays';
import { format } from 'date-fns';

export const useWorkingHours = () => {
  const { settings, updateSettings } = useUserSettings();
  const { toast } = useToast();

  const checkWorkingHours = (date: Date, hour?: number) => {
    if (!settings) return false;

    const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof settings.working_hours;
    const daySettings = settings.working_hours[dayOfWeek];
    const holiday = isHoliday(date);

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return false;
    }

    if (holiday && !settings.allow_work_on_holidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return false;
    }

    if (hour !== undefined) {
      const [startHour] = daySettings.start.split(':').map(Number);
      const [endHour] = daySettings.end.split(':').map(Number);

      if (hour < startHour || hour >= endHour) {
        toast({
          title: "Çalışma saatleri dışında",
          description: "Seçilen saat çalışma saatleri dışındadır.",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const updateWorkingHours = async (newWorkingHours: typeof settings.working_hours) => {
    if (!settings) return;
    
    await updateSettings.mutateAsync({
      working_hours: newWorkingHours
    });
  };

  return {
    workingHours: settings?.working_hours,
    allowWorkOnHolidays: settings?.allow_work_on_holidays,
    checkWorkingHours,
    updateWorkingHours,
    isLoading: !settings
  };
};