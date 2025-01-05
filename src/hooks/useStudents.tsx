import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStudentStore } from "@/store/studentStore";
import { useSession } from '@supabase/auth-helpers-react';

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { closeDialog } = useStudentStore();
  const session = useSession();

  const getStudents = async (): Promise<Student[]> => {
    if (!session?.user?.id) {
      console.error('No authenticated user');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', session.user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      return data.map(student => ({
        ...student,
        price: Number(student.price)
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
    queryKey: ['students', session?.user?.id],
    queryFn: getStudents,
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
          id: student.id,
          name: student.name,
          price: student.price,
          color: student.color,
          user_id: session.user.id
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
      queryClient.setQueryData(['students'], context?.previousStudents);
      console.error('Error in saveStudent mutation:', err);
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
      queryClient.setQueryData(['students'], context?.previousStudents);
      console.error('Error in deleteStudent mutation:', err);
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      closeDialog();
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students,
    saveStudent,
    deleteStudent,
    isLoading,
    error
  };
}