import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStudentStore } from "@/store/studentStore";
import { useSessionContext } from '@supabase/auth-helpers-react';

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { closeDialog } = useStudentStore();
  const { session, isLoading: isSessionLoading } = useSessionContext();

  const getStudents = async (): Promise<Student[]> => {
    if (!session?.user.id) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
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
    queryKey: ['students', session?.user.id],
    queryFn: getStudents,
    enabled: !!session && !isSessionLoading,
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000,
  });

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      const { data, error } = await supabase
        .from('students')
        .upsert({
          id: student.id,
          name: student.name,
          price: student.price,
          color: student.color
        })
        .select()
        .single();

      if (error) throw error;
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;
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
