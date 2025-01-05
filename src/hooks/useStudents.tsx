import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get students from localStorage with error handling
  const getStudents = (): Student[] => {
    try {
      const savedStudents = localStorage.getItem('students');
      if (!savedStudents) return [];
      
      const parsedStudents = JSON.parse(savedStudents);
      if (!Array.isArray(parsedStudents)) {
        throw new Error('Invalid students data format');
      }
      
      return parsedStudents;
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Hata",
        description: "Öğrenci verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Save students to localStorage with validation
  const saveStudents = async (students: Student[]): Promise<Student[]> => {
    try {
      if (!Array.isArray(students)) {
        throw new Error('Invalid students data');
      }
      
      // Validate each student object
      students.forEach(student => {
        if (!student.id || !student.name || typeof student.price !== 'number') {
          throw new Error('Invalid student data format');
        }
      });

      localStorage.setItem('students', JSON.stringify(students));
      return students;
    } catch (error) {
      console.error('Error saving students:', error);
      toast({
        title: "Hata",
        description: "Öğrenci verileri kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Query for fetching students with memoization
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    staleTime: 1000 * 60, // Cache for 1 minute
    gcTime: 1000 * 60 * 5, // Keep unused data for 5 minutes
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
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
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
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    students,
    saveStudent,
    deleteStudent,
    isLoading,
    error
  };
}