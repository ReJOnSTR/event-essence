import { useState, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LessonRow {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  student_id: string | null;
}

export function useCalendarData() {
  const [lessons, setLessons] = useState<CalendarEvent[]>([]);
  const { toast } = useToast();

  // Load data from Supabase
  useEffect(() => {
    const loadLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            description,
            start_time,
            end_time,
            student_id
          `);

        if (error) throw error;

        const formattedLessons: CalendarEvent[] = (data as LessonRow[]).map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || undefined,
          start: new Date(lesson.start_time),
          end: new Date(lesson.end_time),
          studentId: lesson.student_id || undefined
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
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        start: new Date(data.start_time),
        end: new Date(data.end_time),
        studentId: data.student_id || undefined
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