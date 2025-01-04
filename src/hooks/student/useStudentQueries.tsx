import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";

export function useStudentQueries() {
  const fetchStudents = async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }

    return data.map(student => ({
      id: student.id,
      name: student.name,
      color: student.color || undefined,
      price: student.price
    }));
  };

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });

  return {
    students,
    isLoading,
    error
  };
}