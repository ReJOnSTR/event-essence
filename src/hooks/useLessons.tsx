import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';

export function useLessons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session, isLoading: isSessionLoading } = useSessionContext();

  const getLessons = async (): Promise<Lesson[]> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;

      return data.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || undefined,
        start: new Date(lesson.start_time),
        end: new Date(lesson.end_time),
        studentId: lesson.student_id || undefined,
        recurrenceType: lesson.recurrence_type || "none",
        recurrenceCount: lesson.recurrence_interval || 1,
        parentLessonId: lesson.parent_lesson_id || undefined
      }));
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast({
        title: "Hata",
        description: "Dersler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return [];
    }
  };

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons', session?.user.id],
    queryFn: getLessons,
    enabled: !!session && !isSessionLoading,
  });

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Lesson) => {
      const { data, error } = await supabase
        .from('lessons')
        .upsert({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          start_time: lesson.start.toISOString(),
          end_time: lesson.end.toISOString(),
          student_id: lesson.studentId,
          recurrence_type: lesson.recurrenceType,
          recurrence_interval: lesson.recurrenceCount,
          parent_lesson_id: lesson.parentLessonId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newLesson) => {
      await queryClient.cancelQueries({ queryKey: ['lessons'] });
      const previousLessons = queryClient.getQueryData(['lessons']);
      queryClient.setQueryData(['lessons'], (old: Lesson[] = []) => {
        const filtered = old.filter(lesson => lesson.id !== newLesson.id);
        return [...filtered, newLesson];
      });
      return { previousLessons };
    },
    onError: (err, newLesson, context) => {
      queryClient.setQueryData(['lessons'], context?.previousLessons);
      toast({
        title: "Hata",
        description: "Ders kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ders başarıyla kaydedildi.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
    },
    onMutate: async (deletedLessonId) => {
      await queryClient.cancelQueries({ queryKey: ['lessons'] });
      const previousLessons = queryClient.getQueryData(['lessons']);
      queryClient.setQueryData(['lessons'], (old: Lesson[] = []) => 
        old.filter(lesson => lesson.id !== deletedLessonId)
      );
      return { previousLessons };
    },
    onError: (err, deletedLessonId, context) => {
      queryClient.setQueryData(['lessons'], context?.previousLessons);
      toast({
        title: "Hata",
        description: "Ders silinirken bir hata oluştu.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ders başarıyla silindi.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  return {
    lessons,
    saveLesson,
    deleteLesson,
    isLoading,
    error
  };
}