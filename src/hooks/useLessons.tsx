import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { validateDate } from "@/utils/dateUtils";

export function useLessons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get lessons from localStorage with validation
  const getLessons = (): Lesson[] => {
    try {
      const savedLessons = localStorage.getItem('lessons');
      if (!savedLessons) return [];
      
      const parsedLessons = JSON.parse(savedLessons);
      if (!Array.isArray(parsedLessons)) {
        throw new Error('Invalid lessons data format');
      }

      // Validate and transform dates
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

  // Save lessons to localStorage with validation
  const saveLessons = async (lessons: Lesson[]): Promise<Lesson[]> => {
    try {
      if (!Array.isArray(lessons)) {
        throw new Error('Invalid lessons data');
      }

      // Validate each lesson object
      lessons.forEach(lesson => {
        if (!lesson.id || !lesson.title || !validateDate(lesson.start) || !validateDate(lesson.end)) {
          throw new Error('Invalid lesson data format');
        }
      });

      localStorage.setItem('lessons', JSON.stringify(lessons));
      return lessons;
    } catch (error) {
      console.error('Error saving lessons:', error);
      toast({
        title: "Hata",
        description: "Ders verileri kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Query for fetching lessons with memoization
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: getLessons,
    staleTime: 1000 * 60, // Cache for 1 minute
    gcTime: 1000 * 60 * 5, // Keep unused data for 5 minutes
  });

  // Mutation for adding/updating a lesson
  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Lesson): Promise<Lesson[]> => {
      const currentLessons = getLessons();
      const existingIndex = currentLessons.findIndex(l => l.id === lesson.id);
      
      let updatedLessons;
      if (existingIndex >= 0) {
        updatedLessons = [
          ...currentLessons.slice(0, existingIndex),
          lesson,
          ...currentLessons.slice(existingIndex + 1)
        ];
      } else {
        updatedLessons = [...currentLessons, { ...lesson, id: crypto.randomUUID() }];
      }
      
      return saveLessons(updatedLessons);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Başarılı",
        description: "Ders başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Ders kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  // Mutation for deleting a lesson
  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (lessonId: string): Promise<Lesson[]> => {
      const currentLessons = getLessons();
      const updatedLessons = currentLessons.filter(l => l.id !== lessonId);
      return saveLessons(updatedLessons);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Başarılı",
        description: "Ders başarıyla silindi.",
      });
    },
    onError: (error) => {
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