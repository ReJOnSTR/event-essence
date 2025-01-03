import { CalendarEvent, Student } from "@/types/calendar";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { getDefaultLessonDuration } from "@/utils/settings";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion, AnimatePresence } from "framer-motion";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function DayView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate,
  students 
}: DayViewProps) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const holiday = isHoliday(date);
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  
  const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours[dayOfWeek];

  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  // Parse working hours
  const startHour = daySettings?.enabled ? 
    parseInt(daySettings.start.split(':')[0]) : 
    9;
  const endHour = daySettings?.enabled ? 
    parseInt(daySettings.end.split(':')[0]) : 
    17;

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleHourClick = (hour: number, minute: number) => {
    const eventDate = new Date(date);
    eventDate.setHours(hour, minute);
    
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const currentTime = `${hour}:00`;
    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    onDateSelect(eventDate);
  };

  const getTimeIndicator = (hour: number, events: CalendarEvent[]) => {
    const hourEvents = events.filter(event => {
      const eventHour = new Date(event.start).getHours();
      const eventEndHour = new Date(event.end).getHours();
      const eventEndMinutes = new Date(event.end).getMinutes();
      return eventHour === hour && (eventEndHour > hour || (eventEndHour === hour && eventEndMinutes > 0));
    });

    if (hourEvents.length === 0) return null;

    return hourEvents.map(event => {
      const startMinutes = new Date(event.start).getMinutes();
      const endHour = new Date(event.end).getHours();
      const endMinutes = new Date(event.end).getMinutes();
      
      // Eğer ders aynı saat dilimi içinde bitiyorsa
      if (endHour === hour) {
        return (
          <div key={event.id} className="absolute left-0 h-4 flex items-center text-xs text-gray-500">
            <div className="w-1 h-full bg-gray-300 mr-1" style={{
              height: `${(endMinutes / 60) * 100}%`
            }} />
            {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
          </div>
        );
      }
      
      // Eğer ders sonraki saate taşıyorsa
      return (
        <div key={event.id} className="absolute left-0 h-4 flex items-center text-xs text-gray-500">
          <div className="w-1 h-full bg-gray-300 mr-1" style={{
            height: "100%"
          }} />
          {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
        </div>
      );
    });
  };

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <AnimatePresence>
        {holiday && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "mb-4 p-2 rounded-md border",
              !allowWorkOnHolidays ? "bg-red-50 text-red-700 border-red-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
            )}
          >
            {holiday.name} - {allowWorkOnHolidays ? "Çalışmaya Açık Tatil" : "Resmi Tatil"}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {hours.map((hour, index) => (
          <motion.div 
            key={hour}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.25,
              delay: index * 0.02,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="grid grid-cols-12 gap-2"
          >
            <div className="col-span-1 text-right text-sm text-gray-500 relative">
              {`${hour.toString().padStart(2, '0')}:00`}
              {getTimeIndicator(hour, dayEvents)}
            </div>
            <div 
              className={cn(
                "col-span-11 min-h-[60px] border-t border-gray-200 cursor-pointer hover:bg-gray-50 relative",
                (!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)) && 
                "bg-gray-100 cursor-not-allowed"
              )}
              onClick={() => handleHourClick(hour, 0)}
            >
              {dayEvents
                .filter(event => new Date(event.start).getHours() === hour)
                .map(event => (
                  <LessonCard 
                    key={event.id} 
                    event={event} 
                    onClick={onEventClick}
                    students={students}
                  />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}