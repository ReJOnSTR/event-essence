import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveStudent, isPending: isSaving } = useMutation({
    mutationFn: async (student: Student) => {
      console.log('Attempting to save student:', student);
      
      const studentData = {
        name: student.name,
        color: student.color || "#1a73e8",
        price: student.price,
        updated_at: new Date().toISOString()
      };

      let result;

      if (student.id) {
        const { data, error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', student.id)
          .select()
          .maybeSingle();
        
        if (error) {
          console.error('Error updating student:', error);
          throw new Error(error.message);
        }

        result = data;
      } else {
        const { data, error } = await supabase
          .from('students')
          .insert(studentData)
          .select()
          .maybeSingle();
        
        if (error) {
          console.error('Error inserting student:', error);
          throw new Error(error.message);
        }

        result = data;
      }

      if (!result) {
        throw new Error('Failed to save student');
      }

      console.log('Saved student:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla kaydedildi.",
      });
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu: " + error.message,
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteStudent, isPending: isDeleting } = useMutation({
    mutationFn: async (studentId: string) => {
      console.log('Attempting to delete student:', studentId);
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
      
      if (error) {
        console.error('Error deleting student:', error);
        throw new Error(error.message);
      }
      console.log('Successfully deleted student:', studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      console.error('Delete error:', error);
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu: " + error.message,
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