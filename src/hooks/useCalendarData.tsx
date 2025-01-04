import { useState, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useCalendarData() {
  const [lessons, setLessons] = useState<CalendarEvent[]>([]);
  const { toast } = useToast();

  // Verileri Supabase'den yükle
  useEffect(() => {
    const loadLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            description,
            start_time as start,
            end_time as end,
            student_id as studentId
          `);

        if (error) throw error;

        const formattedLessons = data.map(lesson => ({
          ...lesson,
          start: new Date(lesson.start),
          end: new Date(lesson.end)
        }));

        setLessons(formattedLessons);
      } catch (error) {
        console.error('Dersler yüklenirken hata:', error);
        toast({
          title: "Hata",
          description: "Dersler yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    };

    loadLessons();
  }, [toast]);

  const handleSaveLesson = async (lessonData: Omit<CalendarEvent, "id">) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([{
          title: lessonData.title,
          description: lessonData.description,
          start_time: lessonData.start.toISOString(),
          end_time: lessonData.end.toISOString(),
          student_id: lessonData.studentId
        }])
        .select()
        .single();

      if (error) throw error;

      const newLesson: CalendarEvent = {
        ...lessonData,
        id: data.id
      };

      setLessons(prev => [...prev, newLesson]);
      
      toast({
        title: "Başarılı",
        description: "Ders başarıyla oluşturuldu.",
      });
    } catch (error) {
      console.error('Ders kaydedilirken hata:', error);
      toast({
        title: "Hata",
        description: "Ders kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateLesson = async (lessonId: string, lessonData: Omit<CalendarEvent, "id">) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          title: lessonData.title,
          description: lessonData.description,
          start_time: lessonData.start.toISOString(),
          end_time: lessonData.end.toISOString(),
          student_id: lessonData.studentId
        })
        .eq('id', lessonId);

      if (error) throw error;

      setLessons(prev => prev.map(lesson =>
        lesson.id === lessonId ? { ...lessonData, id: lessonId } : lesson
      ));

      toast({
        title: "Başarılı",
        description: "Ders başarıyla güncellendi.",
      });
    } catch (error) {
      console.error('Ders güncellenirken hata:', error);
      toast({
        title: "Hata",
        description: "Ders güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      
      toast({
        title: "Başarılı",
        description: "Ders başarıyla silindi.",
      });
    } catch (error) {
      console.error('Ders silinirken hata:', error);
      toast({
        title: "Hata",
        description: "Ders silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return {
    lessons,
    handleSaveLesson,
    handleUpdateLesson,
    handleDeleteLesson,
    setLessons
  };
}