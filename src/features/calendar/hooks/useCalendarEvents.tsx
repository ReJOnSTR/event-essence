import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { useLessons } from "@/hooks/useLessons";

export function useCalendarEvents() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | undefined>();
  
  const { lessons, saveLesson, deleteLesson } = useLessons();
  const { toast } = useToast();

  const handleDateSelect = (session: any, date: Date) => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (session: any, lesson: CalendarEvent) => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleSaveLesson = (session: any, lessonData: Omit<CalendarEvent, "id">) => {
    if (!session) return;
    
    const lessonToSave = selectedLesson
      ? { ...lessonData, id: selectedLesson.id }
      : { ...lessonData, id: crypto.randomUUID() };
      
    saveLesson(lessonToSave);
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  const handleDeleteLesson = (session: any, lessonId: string) => {
    if (!session) return;
    deleteLesson(lessonId);
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  const handleEventUpdate = (session: any, updatedEvent: CalendarEvent) => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    saveLesson(updatedEvent);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isLoginDialogOpen,
    setIsLoginDialogOpen,
    selectedDate,
    setSelectedDate,
    selectedLesson,
    setSelectedLesson,
    lessons,
    handleDateSelect,
    handleLessonClick,
    handleSaveLesson,
    handleDeleteLesson,
    handleEventUpdate
  };
}