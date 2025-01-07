import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { format } from "date-fns";

export const useWorkingHours = () => {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const checkWorkingHours = (date: Date, hour?: number) => {
    const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
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
    allowWorkOnHolidays,
    checkWorkingHours,
    isHoliday
  };
};