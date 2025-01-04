import { useQuery } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { validateDate } from "@/utils/dateUtils";
import { supabase } from "@/lib/supabase";

export function useLessonQueries() {
  const { toast } = useToast();

  const getLessons = async (): Promise<Lesson[]> => {
    try {
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*')
        .order('start', { ascending: true });

      if (error) throw error;

      return (lessons || []).map(lesson => ({
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
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  return {
    lessons,
    isLoading,
    error
  };
}