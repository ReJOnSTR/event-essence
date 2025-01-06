import { CalendarEvent, Student } from "@/types/calendar";
import LessonCard from "./LessonCard";

interface StaticLessonCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
  index: number;
}

export default function StaticLessonCard(props: StaticLessonCardProps) {
  return <LessonCard {...props} isDraggable={false} />;
}