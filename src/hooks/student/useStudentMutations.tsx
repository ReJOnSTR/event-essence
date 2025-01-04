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

      if (student.id) {
        const { data, error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', student.id)
          .select()
          .maybeSingle();
        
        if (error) {
          console.error('Error updating student:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('Student not found');
        }
        
        console.log('Updated student:', data);
        return data;
      } else {
        const { data, error } = await supabase
          .from('students')
          .insert(studentData)
          .select()
          .maybeSingle();
        
        if (error) {
          console.error('Error inserting student:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('Failed to create student');
        }
        
        console.log('Inserted student:', data);
        return data;
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
      console.log('Attempting to delete student:', studentId);
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
      
      if (error) {
        console.error('Error deleting student:', error);
        throw error;
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