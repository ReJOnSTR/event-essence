import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();

  const getStudents = async (): Promise<Student[]> => {
    if (!session?.user.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Hata",
        description: "Öğrenci verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      throw error;
    }

    return data || [];
  };

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students', session?.user.id],
    queryFn: getStudents,
    enabled: !!session?.user.id
  });

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Omit<Student, 'id' | 'user_id'>): Promise<Student> => {
      if (!session?.user.id) {
        throw new Error('User not authenticated');
      }

      const studentData = {
        ...student,
        user_id: session.user.id
      };

      if (student.id) {
        // Update existing student
        const { data, error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', student.id)
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new student
        const { data, error } = await supabase
          .from('students')
          .insert([studentData])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      console.error('Error saving student:', error);
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string): Promise<void> => {
      if (!session?.user.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onError: (error) => {
      console.error('Error deleting student:', error);
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