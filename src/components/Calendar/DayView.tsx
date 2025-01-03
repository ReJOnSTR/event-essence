import { CalendarEvent, Student } from "@/types/calendar";
import { format, isToday, addMinutes, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { getDefaultLessonDuration } from "@/utils/settings";
import { isHoliday } from "@/utils/turkishHolidays";
import { useDrop } from 'react-dnd';

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

  const handleDrop = (hour: number, minute: number, item: { event: CalendarEvent }) => {
    if (!onEventUpdate) return;

    const newStart = new Date(date);
    newStart.setHours(hour, minute);
    
    const duration = differenceInMinutes(item.event.end, item.event.start);
    const newEnd = addMinutes(newStart, duration);

    onEventUpdate({
      ...item.event,
      start: newStart,
      end: newEnd,
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni konumuna taşındı.",
    });
  };

  const handlePaste = (hour: number, minute: number, e: React.ClipboardEvent) => {
    const copiedLessonStr = localStorage.getItem('copiedLesson');
    if (!copiedLessonStr) return;

    try {
      const copiedLesson: CalendarEvent = JSON.parse(copiedLessonStr);
      const duration = differenceInMinutes(copiedLesson.end, copiedLesson.start);
      
      const newStart = new Date(date);
      newStart.setHours(hour, minute);
      const newEnd = addMinutes(newStart, duration);

      const newLesson: CalendarEvent = {
        ...copiedLesson,
        id: crypto.randomUUID(),
        start: newStart,
        end: newEnd,
      };

      if (onEventUpdate) {
        onEventUpdate(newLesson);
        toast({
          title: "Ders yapıştırıldı",
          description: "Ders başarıyla kopyalandı ve yapıştırıldı.",
        });
      }
    } catch (error) {
      console.error('Error pasting lesson:', error);
      toast({
        title: "Hata",
        description: "Ders yapıştırılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full">
      {holiday && (
        <div className={cn(
          "mb-4 p-2 rounded-md border",
          !allowWorkOnHolidays ? "bg-red-50 text-red-700 border-red-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
        )}>
          {holiday.name} - {allowWorkOnHolidays ? "Çalışmaya Açık Tatil" : "Resmi Tatil"}
        </div>
      )}
      <div className="space-y-2">
        {hours.map((hour) => {
          const [{ isOver }, drop] = useDrop(() => ({
            accept: 'LESSON',
            drop: (item: { event: CalendarEvent }) => handleDrop(hour, 0, item),
            collect: (monitor) => ({
              isOver: monitor.isOver(),
            }),
          }));

          return (
            <div key={hour} className="grid grid-cols-12 gap-2">
              <div className="col-span-1 text-right text-sm text-gray-500">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              <div 
                ref={drop}
                className={cn(
                  "col-span-11 min-h-[60px] border-t border-gray-200 cursor-pointer hover:bg-gray-50 relative",
                  (!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)) && 
                  "bg-gray-100 cursor-not-allowed",
                  isOver && "bg-blue-50"
                )}
                onClick={() => handleHourClick(hour, 0)}
                onPaste={(e) => handlePaste(hour, 0, e)}
                tabIndex={0}
              >
                {dayEvents
                  .filter(event => new Date(event.start).getHours() === hour)
                  .map(event => (
                    <LessonCard 
                      key={event.id} 
                      event={event} 
                      onClick={onEventClick}
                      onEventUpdate={onEventUpdate}
                      students={students}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}