import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useStudentQueries() {
  const { toast } = useToast();

  const fetchStudents = async (): Promise<Student[]> => {
    const {
      data: { user },
      error: sessionError
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      throw new Error("Authentication required");
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
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
    queryFn: fetchStudents,
    onError: (error: Error) => {
      console.error('Error in students query:', error);
      toast({
        title: "Hata",
        description: "Öğrenciler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    students,
    isLoading,
    error
  };
}