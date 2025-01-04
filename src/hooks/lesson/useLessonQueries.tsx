import { useQuery } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLessonQueries() {
  const { toast } = useToast();

  const getLessons = async (): Promise<Lesson[]> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('start');
      
      if (error) throw error;
      
      return data.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || undefined,
        start: new Date(lesson.start),
        end: new Date(lesson.end),
        studentId: lesson.student_id || undefined
      }));
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast({
        title: "Hata",
        description: "Ders verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return [];
    }
  };

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: getLessons,
  });

  return {
    lessons,
    isLoading,
    error
  };
}