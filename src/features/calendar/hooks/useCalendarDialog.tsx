import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";

export const useCalendarDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | undefined>();
  const [dialogSelectedDate, setDialogSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setDialogSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: CalendarEvent) => {
    setSelectedLesson(lesson);
    setDialogSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  return {
    isDialogOpen,
    selectedLesson,
    dialogSelectedDate,
    handleDateSelect,
    handleLessonClick,
    handleCloseDialog,
    setIsDialogOpen,
  };
};