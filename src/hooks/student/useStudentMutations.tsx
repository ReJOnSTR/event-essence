import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      try {
        if (student.id) {
          // Update existing student
          const { data, error } = await supabase
            .from('students')
            .update({
              name: student.name,
              color: student.color,
              price: student.price
            })
            .eq('id', student.id)
            .select()
            .single();

          if (error) throw error;
          return data;
        } else {
          // Create new student
          const { data, error } = await supabase
            .from('students')
            .insert([{
              name: student.name,
              color: student.color,
              price: student.price
            }])
            .select()
            .single();

          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error('Error saving student:', error);
        throw error;
      }
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
    mutationFn: async (studentId: string) => {
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