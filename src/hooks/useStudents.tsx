import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session } = useSessionContext();

  const getStudents = async (): Promise<Student[]> => {
    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading students:', error);
      throw error;
    }

    return data || [];
  };

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    enabled: !!session?.user
  });

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (studentData: Omit<Student, 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!session?.user) {
        throw new Error('Not authenticated');
      }

      const student = {
        ...studentData,
        user_id: session.user.id,
      };

      if (student.id) {
        const { error } = await supabase
          .from('students')
          .update(student)
          .eq('id', student.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('students')
          .insert([student]);

        if (error) throw error;
      }

      return student;
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
    mutationFn: async (studentId: string) => {
      if (!session?.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;
      return studentId;
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