import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveStudent = async (student: Student) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('students')
        .upsert({
          id: student.id,
          name: student.name,
          color: student.color,
          price: student.price,
          user_id: user.id // Set the user_id here
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error saving student:', error);
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error saving student:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
  };

  const { mutateAsync: saveMutation } = useMutation({
    mutationFn: saveStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci kaydedildi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilemedi: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteStudent = async (studentId: string) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  };

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: "Öğrenci silinemedi: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    saveStudent: saveMutation,
    deleteStudent: deleteMutation,
  };
}