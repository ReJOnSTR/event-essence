import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Omit<Student, 'id'>): Promise<Student> => {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: student.name,
          price: student.price,
          color: student.color
        }])
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        color: data.color
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla kaydedildi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string): Promise<void> => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    saveStudent,
    deleteStudent
  };
}