import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLessonMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (lesson.id) {
        const { error } = await supabase
          .from('lessons')
          .update({
            title: lesson.title,
            description: lesson.description,
            start: lesson.start.toISOString(),
            end: lesson.end.toISOString(),
            student_id: lesson.studentId,
            updated_at: new Date().toISOString()
          })
          .eq('id', lesson.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({
            title: lesson.title,
            description: lesson.description,
            start: lesson.start.toISOString(),
            end: lesson.end.toISOString(),
            student_id: lesson.studentId
          });
        
        if (error) throw error;
      }
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
    mutationFn: async (lessonId: string) => {
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