import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";

export function useStudents() {
  const queryClient = useQueryClient();

  // Get students from localStorage
  const getStudents = (): Student[] => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  };

  // Save students to localStorage
  const saveStudents = (students: Student[]): Promise<Student[]> => {
    localStorage.setItem('students', JSON.stringify(students));
    return Promise.resolve(students);
  };

  // Query for fetching students
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  // Mutation for adding/updating a student
  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student): Promise<Student[]> => {
      const currentStudents = getStudents();
      const existingIndex = currentStudents.findIndex(s => s.id === student.id);
      
      let updatedStudents;
      if (existingIndex >= 0) {
        updatedStudents = [
          ...currentStudents.slice(0, existingIndex),
          student,
          ...currentStudents.slice(existingIndex + 1)
        ];
      } else {
        updatedStudents = [...currentStudents, { ...student, id: crypto.randomUUID() }];
      }
      
      return saveStudents(updatedStudents);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  // Mutation for deleting a student
  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string): Promise<Student[]> => {
      const currentStudents = getStudents();
      const updatedStudents = currentStudents.filter(s => s.id !== studentId);
      return saveStudents(updatedStudents);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students,
    saveStudent,
    deleteStudent,
  };
}