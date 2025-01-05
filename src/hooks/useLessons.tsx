import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarEvent } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export function useLessons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const getLessons = async (): Promise<CalendarEvent[]> => {
    if (!session?.user) {
      navigate('/login');
      return [];
    }

    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        student:students(*)
      `)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error loading lessons:', error);
      toast({
        title: "Hata",
        description: "Ders verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return [];
    }

    return data.map(lesson => ({
      id: lesson.id,
      title: lesson.title || '',
      description: lesson.description || '',
      start: new Date(lesson.start_time),
      end: new Date(lesson.end_time),
      studentId: lesson.student_id,
      student: lesson.student
    })) || [];
  };

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: getLessons,
    enabled: !!session?.user
  });

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: CalendarEvent) => {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      const lessonData = {
        title: lesson.title,
        description: lesson.description,
        start_time: lesson.start.toISOString(),
        end_time: lesson.end.toISOString(),
        student_id: lesson.studentId,
        user_id: session.user.id
      };

      if (lesson.id) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', lesson.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([lessonData]);

        if (error) throw error;
      }

      return lesson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Başarılı",
        description: "Ders başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      console.error('Error saving lesson:', error);
      toast({
        title: "Hata",
        description: "Ders kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      return lessonId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Başarılı",
        description: "Ders başarıyla silindi.",
      });
    },
    onError: (error) => {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Hata",
        description: "Ders silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    lessons,
    saveLesson,
    deleteLesson,
    isLoading,
    error
  };
}