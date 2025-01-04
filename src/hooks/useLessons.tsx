import { useLessonQueries } from "./lesson/useLessonQueries";
import { useLessonMutations } from "./lesson/useLessonMutations";

export function useLessons() {
  const { lessons, isLoading, error } = useLessonQueries();
  const { saveLesson, deleteLesson } = useLessonMutations();

  return {
    lessons,
    saveLesson,
    deleteLesson,
    isLoading,
    error
  };
}