import { useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { DropResult } from "@hello-pangea/dnd";
import { CalendarEvent } from "@/types/calendar";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useWorkingHours } from "./useWorkingHours";
import { useUserSettings } from "./useUserSettings";
import { addDays, startOfWeek, differenceInMinutes } from "date-fns";

interface DragDropConfig {
  view: 'day' | 'week' | 'month' | 'year';
  date: Date;
  events: CalendarEvent[];
  onEventUpdate?: (event: CalendarEvent) => void;
}

export const useDragDropManager = ({
  view,
  date,
  events,
  onEventUpdate
}: DragDropConfig) => {
  const { toast } = useToast();
  const { checkWorkingHours } = useWorkingHours();
  const { settings } = useUserSettings();
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  const customHolidays = settings?.holidays || [];

  const calculateNewTimes = useCallback((
    result: DropResult,
    event: CalendarEvent
  ): { start: Date; end: Date } | null => {
    if (!result.destination) return null;

    const duration = differenceInMinutes(
      new Date(event.end),
      new Date(event.start)
    );

    switch (view) {
      case 'day': {
        // Format: "hour:minute"
        const [hourStr, minuteStr] = result.destination.droppableId.split(':');
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr || '0');
        
        const newStart = new Date(date);
        newStart.setHours(hour, minute, 0, 0);
        const newEnd = new Date(newStart.getTime() + duration * 60000);
        
        return { start: newStart, end: newEnd };
      }

      case 'week': {
        // Format: "dayIndex-hour"
        const [dayIndex, hour] = result.destination.droppableId.split('-').map(Number);
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const targetDay = addDays(weekStart, dayIndex);
        
        const eventStart = new Date(event.start);
        const newStart = new Date(targetDay);
        newStart.setHours(hour, eventStart.getMinutes(), 0, 0);
        const newEnd = new Date(newStart.getTime() + duration * 60000);
        
        return { start: newStart, end: newEnd };
      }

      case 'month':
      case 'year': {
        // Format: "dayIndex"
        const dayIndex = parseInt(result.destination.droppableId);
        
        // For month view, we need to get the days array
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDay);
        
        const targetDay = new Date(startDate);
        targetDay.setDate(targetDay.getDate() + dayIndex);
        
        const eventStart = new Date(event.start);
        const newStart = new Date(targetDay);
        newStart.setHours(eventStart.getHours(), eventStart.getMinutes(), 0, 0);
        const newEnd = new Date(newStart.getTime() + duration * 60000);
        
        return { start: newStart, end: newEnd };
      }

      default:
        return null;
    }
  }, [view, date]);

  const validateMove = useCallback((
    newStart: Date,
    newEnd: Date,
    eventId: string
  ): { valid: boolean; message?: string } => {
    // Check working hours
    const dayOfWeek = newStart.getDay();
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = settings?.working_hours?.[weekDays[dayOfWeek]];

    if (!daySettings?.enabled) {
      return {
        valid: false,
        message: "Bu gün için çalışma saatleri kapalıdır."
      };
    }

    // Check if time is within working hours
    const hour = newStart.getHours();
    const startHour = parseInt(daySettings.start.split(':')[0]);
    const endHour = parseInt(daySettings.end.split(':')[0]);

    if (hour < startHour || hour >= endHour) {
      return {
        valid: false,
        message: "Bu saat çalışma saatleri dışındadır."
      };
    }

    // Check custom holidays
    const isCustomHoliday = customHolidays.some(holiday => 
      new Date(holiday.date).toDateString() === newStart.toDateString()
    );

    if (isCustomHoliday && !allowWorkOnHolidays) {
      return {
        valid: false,
        message: "Bu gün özel tatil günü olarak işaretlenmiş."
      };
    }

    // Check for conflicts
    const hasConflict = checkLessonConflict(
      { start: newStart, end: newEnd },
      events,
      eventId
    );

    if (hasConflict) {
      return {
        valid: false,
        message: "Seçilen saatte başka bir ders bulunuyor."
      };
    }

    return { valid: true };
  }, [settings, customHolidays, allowWorkOnHolidays, events]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const event = events.find(e => e.id === result.draggableId);
    if (!event) return;

    // Calculate new times based on view
    const newTimes = calculateNewTimes(result, event);
    if (!newTimes) return;

    // Validate the move
    const validation = validateMove(newTimes.start, newTimes.end, event.id);
    if (!validation.valid) {
      toast({
        title: "Taşıma başarısız",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }

    // Update the event
    onEventUpdate({
      ...event,
      start: newTimes.start,
      end: newTimes.end
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni konuma taşındı.",
    });
  }, [events, onEventUpdate, calculateNewTimes, validateMove, toast]);

  return {
    handleDragEnd
  };
};