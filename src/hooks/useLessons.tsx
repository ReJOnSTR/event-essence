import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export function useLessons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();

  const getLessons = async (): Promise<Lesson[]> => {
    if (!session?.user.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*, student:students(*)')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error loading lessons:', error);
      toast({
        title: "Hata",
        description: "Ders verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      throw error;
    }

    return data.map(lesson => ({
      ...lesson,
      start: new Date(lesson.start_time),
      end: new Date(lesson.end_time)
    })) || [];
  };

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons', session?.user.id],
    queryFn: getLessons,
    enabled: !!session?.user.id
  });

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Omit<Lesson, 'id' | 'user_id'>): Promise<Lesson> => {
      if (!session?.user.id) {
        throw new Error('User not authenticated');
      }

      const lessonData = {
        ...lesson,
        user_id: session.user.id,
        start_time: lesson.start.toISOString(),
        end_time: lesson.end.toISOString()
      };

      if (lesson.id) {
        // Update existing lesson
        const { data, error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', lesson.id)
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) throw error;
        return {
          ...data,
          start: new Date(data.start_time),
          end: new Date(data.end_time)
        };
      } else {
        // Insert new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert([lessonData])
          .select()
          .single();

        if (error) throw error;
        return {
          ...data,
          start: new Date(data.start_time),
          end: new Date(data.end_time)
        };
      }
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
    mutationFn: async (lessonId: string): Promise<void> => {
      if (!session?.user.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)
        .eq('user_id', session.user.id);

      if (error) throw error;
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