import { useStudentQueries } from "./student/useStudentQueries";
import { useStudentMutations } from "./student/useStudentMutations";

export function useStudents() {
  const { students, isLoading, error, refetch } = useStudentQueries();
  const { saveStudent, deleteStudent, isSaving, isDeleting } = useStudentMutations();

  return {
    students,
    saveStudent,
    deleteStudent,
    isLoading,
    isSaving,
    isDeleting,
    error,
    refetch
  };
}