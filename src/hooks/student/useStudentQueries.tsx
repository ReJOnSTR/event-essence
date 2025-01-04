import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function useStudentQueries() {
  const { toast } = useToast();

  const getStudents = async (): Promise<Student[]> => {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;

      return (students || []).map(student => ({
        id: student.id,
        name: student.name,
        color: student.color || undefined,
        price: student.price
      }));
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