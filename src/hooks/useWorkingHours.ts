import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours, DEFAULT_WORKING_HOURS } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { format } from "date-fns";
import type { WeeklyWorkingHours } from '@/types/settings';

export const useWorkingHours = () => {
  const { toast } = useToast();
  const [workingHours, setWorkingHours] = useState<WeeklyWorkingHours>(DEFAULT_WORKING_HOURS);
  const [isLoading, setIsLoading] = useState(true);
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      const hours = await getWorkingHours();
      setWorkingHours(hours);
    } catch (error) {
      console.error('Error loading working hours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkWorkingHours = (date: Date, hour?: number) => {
    if (isLoading) return false;

    const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof WeeklyWorkingHours;
    const daySettings = workingHours[dayOfWeek];
    const holiday = isHoliday(date);

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return false;
    }

    if (holiday && !allowWorkOnHolidays) {
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

  return {
    workingHours,
    isLoading,
    allowWorkOnHolidays,
    checkWorkingHours,
    isHoliday
  };
};