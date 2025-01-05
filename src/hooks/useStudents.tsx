import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();

  // Query for fetching students
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No session found, returning empty array');
        return [];
      }
      
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Hata",
          description: "Öğrenci verileri yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    },
    enabled: !!session?.user
  });

  // Mutation for adding/updating a student
  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      if (!session?.user) {
        console.error('No session found');
        throw new Error('Not authenticated');
      }

      const studentData = {
        ...student,
        user_id: session.user.id
      };

      if (student.id) {
        // Update existing student
        const { data, error } = await supabase
          .from('students')
          .update({
            name: studentData.name,
            price: studentData.price,
            color: studentData.color,
            updated_at: new Date().toISOString()
          })
          .eq('id', student.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating student:', error);
          throw error;
        }
        return data;
      } else {
        // Insert new student
        const { data, error } = await supabase
          .from('students')
          .insert([{
            name: studentData.name,
            price: studentData.price,
            color: studentData.color,
            user_id: session.user.id
          }])
          .select()
          .single();

        if (error) {
          console.error('Error inserting student:', error);
          throw error;
        }
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
      console.error('Error saving student:', error);
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  // Mutation for deleting a student
  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string) => {
      if (!session?.user) throw new Error('Not authenticated');

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
    onError: (error) => {
      console.error('Error deleting student:', error);
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  return {
    students,
    saveStudent,
    deleteStudent,
    isLoading,
    error
  };
}