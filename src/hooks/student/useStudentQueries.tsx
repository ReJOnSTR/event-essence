import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useStudentQueries() {
  const { toast } = useToast();

  const getStudents = async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Hata",
        description: "Öğrenci verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      throw error;
    }

    return data.map(student => ({
      id: student.id,
      name: student.name,
      price: Number(student.price),
      color: student.color
    }));
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