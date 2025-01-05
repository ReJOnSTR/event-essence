import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();

  // Get students from Supabase with error handling
  const getStudents = async (): Promise<Student[]> => {
    if (!session?.user) {
      navigate('/login');
      return [];
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Hata",
        description: "Öğrenci verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return [];
    }

    return data || [];
  };

  // Query for fetching students
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    enabled: !!session?.user
  });

  // Mutation for adding/updating a student
  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      const studentData = {
        ...student,
        user_id: session.user.id
      };

      if (student.id) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', student.id);

        if (error) throw error;
      } else {
        // Insert new student
        const { error } = await supabase
          .from('students')
          .insert([studentData]);

        if (error) throw error;
      }

      return student;
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
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

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