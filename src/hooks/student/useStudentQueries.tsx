import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useStudentQueries() {
  const { toast } = useToast();

  const getStudents = async (): Promise<Student[]> => {
    console.log('Fetching students...');
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      console.log('Fetched students:', data);
      
      return data?.map(student => ({
        id: student.id,
        name: student.name,
        color: student.color || "#1a73e8",
        price: Number(student.price)
      })) || [];
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

  const { data: students = [], isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  return {
    students,
    isLoading,
    error,
    refetch
  };
}