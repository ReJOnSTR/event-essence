import { differenceInMinutes } from "date-fns";
import { CalendarEvent } from "@/types/calendar";

export const calculateEventHeight = (event: CalendarEvent) => {
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  return Math.max((durationInMinutes / 60) * 60, 40);
};

export const calculateEventTop = (event: CalendarEvent) => {
  const startMinutes = new Date(event.start).getMinutes();
  return (startMinutes / 60) * 60;
};