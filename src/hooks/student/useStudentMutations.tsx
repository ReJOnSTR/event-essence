import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveStudent, isPending: isSaving } = useMutation({
    mutationFn: async (student: Student) => {
      console.log('Saving student:', student);
      if (student.id) {
        const { error } = await supabase
          .from('students')
          .update({
            name: student.name,
            color: student.color,
            price: student.price,
            updated_at: new Date().toISOString()
          })
          .eq('id', student.id);
        
        if (error) {
          console.error('Error updating student:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('students')
          .insert({
            name: student.name,
            color: student.color,
            price: student.price
          });
        
        if (error) {
          console.error('Error inserting student:', error);
          throw error;
        }
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
      console.error('Mutation error:', error);
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteStudent, isPending: isDeleting } = useMutation({
    mutationFn: async (studentId: string) => {
      console.log('Deleting student:', studentId);
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
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    saveStudent,
    deleteStudent,
    isSaving,
    isDeleting
  };
}