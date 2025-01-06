import { CalendarEvent, Student } from "@/types/calendar";
import MonthGrid from "./MonthGrid";
import { format, startOfYear, endOfYear, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";
import { isHoliday } from "@/utils/turkishHolidays";
import { getWorkingHours } from "@/utils/workingHours";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  onEventUpdate,
  students
}: MonthViewProps) {
  const { toast } = useToast();
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  const workingHours = getWorkingHours();

  const getDaysInMonth = (currentDate: Date) => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    let startDay = start.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const prefixDays = Array.from({ length: startDay }, (_, i) => 
      addDays(start, -(startDay - i))
    );
    
    const endDay = end.getDay() - 1;
    const suffixDays = Array.from({ length: endDay === -1 ? 0 : 6 - endDay }, (_, i) =>
      addDays(end, i + 1)
    );
    
    return [...prefixDays, ...days, ...suffixDays].map(dayDate => ({
      date: dayDate,
      isCurrentMonth: isSameMonth(dayDate, currentDate),
      lessons: events.filter(event => {
        const eventStart = new Date(event.start);
        return isSameDay(eventStart, dayDate);
      })
    }));
  };

  const handleDateClick = (clickedDate: Date) => {
    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = workingHours[days[dayOfWeek]];

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const holiday = isHoliday(clickedDate);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }
    
    onDateSelect(clickedDate);
  };

  const days = getDaysInMonth(date);

  if (isYearView) {
    return (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
            <div
              key={day}
              className="bg-background/80 p-1 text-xs font-medium text-muted-foreground text-center"
            >
              {day}
            </div>
          ))}
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            const isDisabled = !workingHours[days[day.date.getDay()]].enabled || (holiday && !allowWorkOnHolidays);
            return (
              <div
                key={idx}
                onClick={() => !isDisabled && handleDateClick(day.date)}
                className={`min-h-[120px] p-2 bg-background/80 transition-colors duration-150 ${!day.isCurrentMonth ? "text-muted-foreground bg-muted/50" : ""} ${isToday(day.date) ? "bg-accent text-accent-foreground" : ""} ${holiday && !allowWorkOnHolidays ? "bg-destructive/10 text-destructive" : ""} ${holiday && allowWorkOnHolidays ? "bg-yellow-500/10 text-yellow-500" : ""} ${isDisabled ? "cursor-not-allowed bg-muted" : "cursor-pointer hover:bg-accent/50"}`}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day.date, "d")}
                  {holiday && (
                    <div className={`text-xs truncate ${!allowWorkOnHolidays ? "text-destructive" : "text-yellow-500"}`}>
                      {holiday.name}
                      {allowWorkOnHolidays && " (Çalışmaya Açık)"}
                    </div>
                  )}
                  {!holiday && !workingHours[days[day.date.getDay()]].enabled && (
                    <div className="text-xs text-muted-foreground truncate">
                      Çalışma Saatleri Kapalı
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {day.lessons.map((event, index) => (
                    <MonthEventCard
                      key={event.id}
                      event={event}
                      students={students}
                      index={index}
                      onClick={onEventClick}
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

  return (
    <MonthGrid
      events={events}
      onDateSelect={onDateSelect}
      date={date}
      onEventClick={onEventClick}
      onEventUpdate={onEventUpdate}
      students={students}
    />
  );
}
