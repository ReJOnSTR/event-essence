import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";

export const useCalendarEvents = () => {
  const [lessons, setLessons] = useState<CalendarEvent[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  const { toast } = useToast();

  const handleSaveLesson = (lessonData: Omit<CalendarEvent, "id">) => {
    if ('id' in lessonData) {
      const updatedLessons = lessons.map(lesson => 
        lesson.id === (lessonData as CalendarEvent).id 
          ? { ...lessonData, id: lesson.id }
          : lesson
      );
      setLessons(updatedLessons);
      toast({
        title: "Ders güncellendi",
        description: "Dersiniz başarıyla güncellendi.",
      });
    } else {
      const newLesson: CalendarEvent = {
        ...lessonData,
        id: crypto.randomUUID(),
        start_time: lessonData.start.toISOString(),
        end_time: lessonData.end.toISOString(),
      };
      setLessons([...lessons, newLesson]);
      toast({
        title: "Ders oluşturuldu",
        description: "Dersiniz başarıyla oluşturuldu.",
      });
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    toast({
      title: "Ders silindi",
      description: "Dersiniz başarıyla silindi.",
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    const updatedLessons = lessons.map(lesson =>
      lesson.id === updatedEvent.id ? updatedEvent : lesson
    );
    setLessons(updatedLessons);
  };

  return {
    lessons,
    handleSaveLesson,
    handleDeleteLesson,
    handleEventUpdate,
  };
};