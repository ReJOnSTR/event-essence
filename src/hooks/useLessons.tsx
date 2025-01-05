import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLessons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
        studentId: lesson.student_id || undefined
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
    queryKey: ['lessons'],
    queryFn: getLessons,
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
          student_id: lesson.studentId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newLesson) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['lessons'] });

      // Snapshot the previous value
      const previousLessons = queryClient.getQueryData(['lessons']);

      // Optimistically update to the new value
      queryClient.setQueryData(['lessons'], (old: Lesson[] = []) => {
        const filtered = old.filter(lesson => lesson.id !== newLesson.id);
        return [...filtered, newLesson];
      });

      // Return a context object with the snapshotted value
      return { previousLessons };
    },
    onError: (err, newLesson, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
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
      // Always refetch after error or success to ensure data consistency
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