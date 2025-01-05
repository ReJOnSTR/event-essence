import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export function useLessons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();

  // Query for fetching lessons
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching lessons:', error);
        toast({
          title: "Hata",
          description: "Ders verileri yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
        return [];
      }

      return data.map(lesson => ({
        ...lesson,
        id: lesson.id,
        title: lesson.title || '',
        description: lesson.description || '',
        start: new Date(lesson.start_time),
        end: new Date(lesson.end_time),
        studentId: lesson.student_id
      }));
    },
    enabled: !!session?.user
  });

  // Mutation for adding/updating a lesson
  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!session?.user) throw new Error('Not authenticated');

      const lessonData = {
        title: lesson.title,
        description: lesson.description,
        start_time: lesson.start.toISOString(),
        end_time: lesson.end.toISOString(),
        student_id: lesson.studentId,
        user_id: session.user.id
      };

      if (lesson.id) {
        // Update existing lesson
        const { data, error } = await supabase
          .from('lessons')
          .update({
            ...lessonData,
            updated_at: new Date().toISOString()
          })
          .eq('id', lesson.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert([lessonData])
          .select()
          .single();

        if (error) throw error;
        return data;
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

  // Mutation for deleting a lesson
  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!session?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

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