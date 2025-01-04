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
          const { data: existingStudent, error: checkError, status } = await supabase
            .from('students')
            .select()
            .eq('id', student.id)
            .maybeSingle();
          
          if (checkError) {
            console.error('Error checking student:', checkError);
            if (status === 0 || status === undefined) {
              throw new Error('Network connection error. Please check your internet connection.');
            }
            throw checkError;
          }

          if (!existingStudent) {
            console.error('Student not found:', student.id);
            throw new Error('Öğrenci bulunamadı veya silinmiş olabilir.');
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
        if (error.message?.includes('Network connection error')) {
          throw error;
        }
        throw new Error(
          student.id 
            ? 'Öğrenci güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
            : 'Öğrenci eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
        );
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
        const { data: existingStudent, error: checkError, status } = await supabase
          .from('students')
          .select()
          .eq('id', studentId)
          .maybeSingle();
        
        if (checkError) {
          console.error('Error checking student:', checkError);
          if (status === 0 || status === undefined) {
            throw new Error('Network connection error. Please check your internet connection.');
          }
          throw checkError;
        }

        if (!existingStudent) {
          throw new Error('Öğrenci bulunamadı veya zaten silinmiş.');
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
        throw new Error(error.message || 'Öğrenci silinirken bir hata oluştu.');
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