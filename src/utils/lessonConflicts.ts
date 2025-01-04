import { CalendarEvent } from "@/types/calendar";
import { areIntervalsOverlapping } from "date-fns";

export const checkLessonConflict = (
  targetEvent: CalendarEvent,
  existingEvents: CalendarEvent[],
  excludeEventId?: string
): boolean => {
  return existingEvents.some(event => {
    if (event.id === excludeEventId) return false;

    return areIntervalsOverlapping(
      { start: new Date(targetEvent.start), end: new Date(targetEvent.end) },
      { start: new Date(event.start), end: new Date(event.end) }
    );
  });
};