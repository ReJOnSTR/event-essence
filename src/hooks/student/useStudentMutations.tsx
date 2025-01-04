import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveStudents = async (students: Student[]): Promise<Student[]> => {
    try {
      if (!Array.isArray(students)) {
        throw new Error('Invalid students data');
      }
      
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

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student): Promise<Student[]> => {
      const currentStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const existingIndex = currentStudents.findIndex((s: Student) => s.id === student.id);
      
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
    onError: () => {
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string): Promise<Student[]> => {
      const currentStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const updatedStudents = currentStudents.filter((s: Student) => s.id !== studentId);
      return saveStudents(updatedStudents);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    saveStudent,
    deleteStudent
  };
}