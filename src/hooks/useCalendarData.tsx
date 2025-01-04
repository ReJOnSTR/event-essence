import { useState, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LessonRow {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  student_id: string | null;
  user_id: string | null;
}

export function useCalendarData() {
  const [lessons, setLessons] = useState<CalendarEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedLessons: CalendarEvent[] = (data as LessonRow[]).map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || undefined,
          start: new Date(lesson.start_time),
          end: new Date(lesson.end_time),
          studentId: lesson.student_id || undefined
        }));

        console.log('Loaded lessons:', formattedLessons);
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

    // Subscribe to changes
    const channel = supabase
      .channel('lessons_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'lessons' 
      }, loadLessons)
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [toast]);

  const handleSaveLesson = async (lessonData: Omit<CalendarEvent, "id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Hata",
          description: "Lütfen giriş yapın.",
          variant: "destructive"
        });
        return;
      }

      console.log('Saving lesson with data:', lessonData);
      
      const { data, error } = await supabase
        .from('lessons')
        .insert([{
          title: lessonData.title,
          description: lessonData.description,
          start_time: lessonData.start.toISOString(),
          end_time: lessonData.end.toISOString(),
          student_id: lessonData.studentId,
          user_id: user.id
        }])
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const newLesson: CalendarEvent = {
          id: data.id,
          title: data.title,
          description: data.description || undefined,
          start: new Date(data.start_time),
          end: new Date(data.end_time),
          studentId: data.student_id || undefined
        };

        console.log('Created new lesson:', newLesson);
        setLessons(prev => [...prev, newLesson]);
        
        toast({
          title: "Başarılı",
          description: "Ders başarıyla oluşturuldu.",
        });
      }
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Hata",
          description: "Lütfen giriş yapın.",
          variant: "destructive"
        });
        return;
      }

      console.log('Updating lesson:', lessonId, 'with data:', lessonData);
      
      const { data, error } = await supabase
        .from('lessons')
        .update({
          title: lessonData.title,
          description: lessonData.description,
          start_time: lessonData.start.toISOString(),
          end_time: lessonData.end.toISOString(),
          student_id: lessonData.studentId,
          user_id: user.id
        })
        .eq('id', lessonId)
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setLessons(prev => prev.map(lesson =>
          lesson.id === lessonId ? {
            id: data.id,
            title: data.title,
            description: data.description || undefined,
            start: new Date(data.start_time),
            end: new Date(data.end_time),
            studentId: data.student_id || undefined
          } : lesson
        ));

        console.log('Updated lesson successfully');
        toast({
          title: "Başarılı",
          description: "Ders başarıyla güncellendi.",
        });
      }
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Hata",
          description: "Lütfen giriş yapın.",
          variant: "destructive"
        });
        return;
      }

      console.log('Deleting lesson:', lessonId);
      
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