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

      try {
        if (student.id) {
          // First check if student exists
          const { data: existingStudent, error: checkError } = await supabase
            .from('students')
            .select()
            .eq('id', student.id)
            .maybeSingle();
          
          if (checkError) {
            console.error('Error checking student:', checkError);
            throw checkError;
          }

          if (!existingStudent) {
            console.error('Student not found:', student.id);
            throw new Error('Student not found');
          }

          // Update existing student
          const { data, error } = await supabase
            .from('students')
            .update(studentData)
            .eq('id', student.id)
            .select()
            .single();
          
          if (error) {
            console.error('Error updating student:', error);
            throw error;
          }

          console.log('Updated student:', data);
          return data;
        } else {
          // Insert new student
          const { data, error } = await supabase
            .from('students')
            .insert([studentData])
            .select()
            .single();
          
          if (error) {
            console.error('Error inserting student:', error);
            throw error;
          }

          console.log('Created student:', data);
          return data;
        }
      } catch (error: any) {
        console.error('Operation failed:', error);
        // Provide a more specific error message based on the operation
        const errorMessage = student.id 
          ? 'Failed to update student: Student may have been deleted'
          : 'Failed to create student';
        throw new Error(errorMessage);
      }
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
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteStudent, isPending: isDeleting } = useMutation({
    mutationFn: async (studentId: string) => {
      console.log('Attempting to delete student:', studentId);
      
      try {
        // First check if student exists
        const { data: existingStudent, error: checkError } = await supabase
          .from('students')
          .select()
          .eq('id', studentId)
          .maybeSingle();
        
        if (checkError) {
          console.error('Error checking student:', checkError);
          throw checkError;
        }

        if (!existingStudent) {
          throw new Error('Student not found or already deleted');
        }

        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', studentId);
        
        if (error) {
          console.error('Error deleting student:', error);
          throw error;
        }
        
        console.log('Successfully deleted student:', studentId);
      } catch (error: any) {
        console.error('Delete operation failed:', error);
        throw new Error(error.message || 'Failed to delete student');
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
      console.error('Delete error:', error);
      toast({
        title: "Hata",
        description: error.message,
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