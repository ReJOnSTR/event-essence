import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useStudentStore } from "@/store/studentStore";

export const useStudents = () => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const { closeDialog } = useStudentStore();

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      if (!session?.user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      if (!session?.user?.id) {
        toast({
          title: "Hata",
          description: "Öğrenci eklemek için oturum açmanız gerekiyor.",
          variant: "destructive"
        });
        throw new Error('Oturum açmanız gerekiyor');
      }

      const { data, error } = await supabase
        .from('students')
        .upsert({
          ...student,
          user_id: session.user.id,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving student:', error);
        throw error;
      }

      return data;
    },
    onMutate: async (newStudent) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData(['students']);
      queryClient.setQueryData(['students'], (old: Student[] = []) => {
        const filtered = old.filter(student => student.id !== newStudent.id);
        return [...filtered, newStudent];
      });
      return { previousStudents };
    },
    onError: (err, newStudent, context) => {
      console.error('Error in saveStudent mutation:', err);
      queryClient.setQueryData(['students'], context?.previousStudents);
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla kaydedildi.",
      });
      closeDialog();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string) => {
      if (!session?.user?.id) {
        toast({
          title: "Hata",
          description: "Öğrenci silmek için oturum açmanız gerekiyor.",
          variant: "destructive"
        });
        throw new Error('Oturum açmanız gerekiyor');
      }

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }
    },
    onMutate: async (deletedStudentId) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData(['students']);
      queryClient.setQueryData(['students'], (old: Student[] = []) => 
        old.filter(student => student.id !== deletedStudentId)
      );
      return { previousStudents };
    },
    onError: (err, deletedStudentId, context) => {
      console.error('Error in deleteStudent mutation:', err);
      queryClient.setQueryData(['students'], context?.previousStudents);
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
      closeDialog();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students,
    isLoading,
    error,
    saveStudent,
    deleteStudent,
  };
};