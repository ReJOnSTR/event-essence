import { format, isToday, setHours, setMinutes, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent } from "@/types/calendar";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { useToast } from "@/components/ui/use-toast";

export function useCalendarLogic() {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const checkDateAvailability = (date: Date, hour?: number) => {
    const holiday = isHoliday(date);
    const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];

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

  const getWorkingHoursForDay = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];
    
    if (!daySettings?.enabled) return null;
    
    const [startHour] = daySettings.start.split(':').map(Number);
    const [endHour] = daySettings.end.split(':').map(Number);
    
    return { startHour, endHour };
  };

  return {
    checkDateAvailability,
    getWorkingHoursForDay,
    workingHours,
    allowWorkOnHolidays
  };
}