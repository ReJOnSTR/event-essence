import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function useLessonMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Lesson) => {
      const lessonData = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        start: lesson.start.toISOString(),
        end: lesson.end.toISOString(),
        student_id: lesson.studentId
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