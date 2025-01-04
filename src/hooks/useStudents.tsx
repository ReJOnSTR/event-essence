import { useStudentQueries } from "./student/useStudentQueries";
import { useStudentMutations } from "./student/useStudentMutations";

export function useStudents() {
  const { students, isLoading, error } = useStudentQueries();
  const { saveStudent, deleteStudent } = useStudentMutations();

  return {
    students,
    saveStudent,
    deleteStudent,
    isLoading,
    error
  };
}