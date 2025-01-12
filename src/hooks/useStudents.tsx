import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';
import { useSessionContext } from '@supabase/auth-helpers-react';

export const useStudents = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session, isLoading: isSessionLoading } = useSessionContext();

  const getStudents = async (): Promise<Student[]> => {
    if (!session?.user) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  };

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students', session?.user?.id],
    queryFn: getStudents,
    enabled: !!session && !isSessionLoading,
  });

  const { mutateAsync: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      const { error } = await supabase
        .from('students')
        .upsert(student);

      if (error) {
        console.error('Error saving student:', error);
        throw error;
      }

      toast({
        title: "Öğrenci kaydedildi",
        description: "Öğrenci bilgileri başarıyla kaydedildi.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const { mutateAsync: deleteStudent } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }

      toast({
        title: "Öğrenci silindi",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students,
    isLoading,
    error,
    saveStudent,
    deleteStudent
  };
};