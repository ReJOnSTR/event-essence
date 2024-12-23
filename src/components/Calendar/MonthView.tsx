import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent, DayCell } from "@/types/calendar";
import { cn } from "@/lib/utils";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export default function MonthView({ events, onDateSelect }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  const getDaysInMonth = (date: Date): DayCell[] => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    
    const startDay = start.getDay();
    const prefixDays = Array.from({ length: startDay }, (_, i) => 
      addDays(start, -(startDay - i))
    );
    
    const endDay = end.getDay();
    const suffixDays = Array.from({ length: 6 - endDay }, (_, i) =>
      addDays(end, i + 1)
    );
    
    return [...prefixDays, ...days, ...suffixDays].map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      events: events.filter(event => isSameDay(event.start, date))
    }));
  };

  const getDaysInWeek = (date: Date): DayCell[] => {
    const start = startOfWeek(date, { locale: tr });
    const end = endOfWeek(date, { locale: tr });
    const days = eachDayOfInterval({ start, end });
    
    return days.map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      events: events.filter(event => isSameDay(event.start, date))
    }));
  };

  const getDaysInYear = (date: Date): DayCell[] => {
    const start = startOfYear(date);
    const end = endOfYear(date);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      events: events.filter(event => isSameDay(event.start, date))
    }));
  };

  const getDayView = (date: Date): DayCell[] => {
    return [{
      date,
      isCurrentMonth: true,
      events: events.filter(event => isSameDay(event.start, date))
    }];
  };

  const getViewDays = (date: Date): DayCell[] => {
    switch (currentView) {
      case 'day':
        return getDayView(date);
      case 'week':
        return getDaysInWeek(date);
      case 'year':
        return getDaysInYear(date);
      default:
        return getDaysInMonth(date);
    }
  };

  const nextPeriod = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, 7));
        break;
      case 'year':
        setCurrentDate(addDays(endOfYear(currentDate), 1));
        break;
      default:
        setCurrentDate(addDays(endOfMonth(currentDate), 1));
    }
  };

  const prevPeriod = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, -7));
        break;
      case 'year':
        setCurrentDate(addDays(startOfYear(currentDate), -1));
        break;
      default:
        setCurrentDate(addDays(startOfMonth(currentDate), -1));
    }
  };

  const days = getViewDays(currentDate);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy", { locale: tr })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="day">Günlük</TabsTrigger>
            <TabsTrigger value="week">Haftalık</TabsTrigger>
            <TabsTrigger value="month">Aylık</TabsTrigger>
            <TabsTrigger value="year">Yıllık</TabsTrigger>
            <TabsTrigger value="today" onClick={() => setCurrentDate(new Date())}>
              Bugün
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={cn(
        "grid gap-px bg-calendar-border rounded-lg overflow-hidden",
        currentView === 'week' && "grid-cols-7",
        currentView === 'month' && "grid-cols-7",
        currentView === 'year' && "grid-cols-12",
        currentView === 'day' && "grid-cols-1"
      )}>
        {currentView !== 'year' && ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-sm font-medium text-calendar-gray text-center"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => onDateSelect(day.date)}
            className={cn(
              "min-h-[120px] p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
              !day.isCurrentMonth && "bg-gray-50 text-gray-400",
              currentView === 'year' && "min-h-[60px]"
            )}
          >
            <div className="text-sm font-medium mb-1">
              {format(day.date, currentView === 'year' ? 'MMM' : 'd', { locale: tr })}
            </div>
            <div className="space-y-1">
              {day.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}