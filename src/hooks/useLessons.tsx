import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lesson } from "@/types/calendar";

export function useLessons() {
  const queryClient = useQueryClient();

  // Get lessons from localStorage
  const getLessons = (): Lesson[] => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  };

  // Save lessons to localStorage
  const saveLessons = (lessons: Lesson[]): Promise<Lesson[]> => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
    return Promise.resolve(lessons);
  };

  // Query for fetching lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: getLessons,
    staleTime: 0,
    gcTime: 0,
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
    },
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
    },
  });

  return {
    lessons,
    saveLesson,
    deleteLesson,
  };
}