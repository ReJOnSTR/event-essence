import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";

export const useCalendarDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: CalendarEvent) => {
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  return {
    isDialogOpen,
    selectedLesson,
    selectedDate,
    handleDateSelect,
    handleLessonClick,
    handleCloseDialog,
    setIsDialogOpen,
  };
};