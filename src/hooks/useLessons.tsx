import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';

export function useLessons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();

  const getLessons = async (): Promise<Lesson[]> => {
    if (!session?.user?.id) {
      console.log('No authenticated user, returning empty lessons array');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error loading lessons:', error);
        throw error;
      }

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
    queryKey: ['lessons', session?.user?.id],
    queryFn: getLessons,
    enabled: !!session?.user?.id,
  });

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!session?.user?.id) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const { data, error } = await supabase
        .from('lessons')
        .upsert({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          start_time: lesson.start.toISOString(),
          end_time: lesson.end.toISOString(),
          student_id: lesson.studentId,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving lesson:', error);
        throw error;
      }
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
      console.error('Error in saveLesson mutation:', err);
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
      if (!session?.user?.id) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error deleting lesson:', error);
        throw error;
      }
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
      console.error('Error in deleteLesson mutation:', err);
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