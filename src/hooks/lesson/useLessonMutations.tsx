import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarEvent } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLessonMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Omit<CalendarEvent, "id">): Promise<CalendarEvent> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('lessons')
        .insert({
          title: lesson.title,
          description: lesson.description,
          start_time: lesson.start.toISOString(),
          end_time: lesson.end.toISOString(),
          student_id: lesson.studentId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        start: new Date(data.start_time),
        end: new Date(data.end_time),
        studentId: data.student_id
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Başarılı",
        description: "Ders başarıyla kaydedildi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ders kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (lessonId: string): Promise<void> => {
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
    onError: () => {
      toast({
        title: "Hata",
        description: "Ders silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    saveLesson,
    deleteLesson
  };
}