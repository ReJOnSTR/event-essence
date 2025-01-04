import { useQuery } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLessonQueries() {
  const { toast } = useToast();

  const getLessons = async (): Promise<Lesson[]> => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('start_time', { ascending: true });

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
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      start: new Date(lesson.start_time),
      end: new Date(lesson.end_time),
      studentId: lesson.student_id
    }));
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