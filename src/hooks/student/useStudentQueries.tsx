import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";

export function useStudentQueries() {
  const { toast } = useToast();

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

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  return {
    students,
    isLoading,
    error
  };
}