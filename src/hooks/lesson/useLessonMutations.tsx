import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { validateDate } from "@/utils/dateUtils";

export function useLessonMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveLessons = async (lessons: Lesson[]): Promise<Lesson[]> => {
    try {
      if (!Array.isArray(lessons)) {
        throw new Error('Invalid lessons data');
      }

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

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (lesson: Lesson): Promise<Lesson[]> => {
      const currentLessons = JSON.parse(localStorage.getItem('lessons') || '[]');
      const existingIndex = currentLessons.findIndex((l: Lesson) => l.id === lesson.id);
      
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
    onError: () => {
      toast({
        title: "Hata",
        description: "Ders kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (lessonId: string): Promise<Lesson[]> => {
      const currentLessons = JSON.parse(localStorage.getItem('lessons') || '[]');
      const updatedLessons = currentLessons.filter((l: Lesson) => l.id !== lessonId);
      return saveLessons(updatedLessons);
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