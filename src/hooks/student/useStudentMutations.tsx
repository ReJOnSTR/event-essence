import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useStudentMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      const {
        data: { user },
        error: sessionError
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from('students')
        .upsert({
          id: student.id,
          name: student.name,
          color: student.color,
          price: student.price,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving student:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla kaydedildi.",
      });
    },
    onError: (error: Error) => {
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
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting student:', error);
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