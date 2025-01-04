import { useQuery } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { validateDate } from "@/utils/dateUtils";

export function useLessonQueries() {
  const { toast } = useToast();

  const getLessons = (): Lesson[] => {
    try {
      const savedLessons = localStorage.getItem('lessons');
      if (!savedLessons) return [];
      
      const parsedLessons = JSON.parse(savedLessons);
      if (!Array.isArray(parsedLessons)) {
        throw new Error('Invalid lessons data format');
      }

      return parsedLessons.map(lesson => ({
        ...lesson,
        start: new Date(lesson.start),
        end: new Date(lesson.end)
      })).filter(lesson => 
        validateDate(lesson.start) && 
        validateDate(lesson.end) &&
        lesson.id &&
        typeof lesson.title === 'string'
      );
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