import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStudentStore } from "@/store/studentStore";
import { useSession } from "@supabase/auth-helpers-react";

export function useStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { closeDialog } = useStudentStore();
  const session = useSession();

  const getStudents = async (): Promise<Student[]> => {
    if (!session) {
      console.log("No session found, returning empty array");
      return [];
    }

    try {
      console.log("Fetching students for user:", session.user.id);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      console.log("Fetched students:", data);
      return data.map(student => ({
        ...student,
        price: Number(student.price)
      }));
    } catch (error) {
      console.error('Error in getStudents:', error);
      toast({
        title: "Hata",
        description: "Öğrenci verileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return [];
    }
  };

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students', session?.user?.id],
    queryFn: getStudents,
    enabled: !!session
  });

  const { mutate: saveStudent } = useMutation({
    mutationFn: async (student: Student) => {
      if (!session) {
        console.error("No session found while trying to save student");
        throw new Error("Oturum açmanız gerekiyor");
      }

      console.log("Saving student:", student);
      console.log("Current session user:", session.user.id);

      const { data, error } = await supabase
        .from('students')
        .upsert({
          id: student.id,
          name: student.name,
          price: student.price,
          color: student.color,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving student:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log("Save successful, returned data:", data);
      return data;
    },
    onMutate: async (newStudent) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData(['students']);
      queryClient.setQueryData(['students'], (old: Student[] = []) => {
        const filtered = old.filter(student => student.id !== newStudent.id);
        return [...filtered, newStudent];
      });
      return { previousStudents };
    },
    onError: (err, newStudent, context) => {
      console.error("Mutation error:", err);
      queryClient.setQueryData(['students'], context?.previousStudents);
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    },
    onSuccess: (data) => {
      console.log("Student saved successfully:", data);
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla kaydedildi.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (studentId: string) => {
      if (!session) {
        console.error("No session found while trying to delete student");
        throw new Error("Oturum açmanız gerekiyor");
      }

      console.log("Deleting student:", studentId);
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }
    },
    onMutate: async (deletedStudentId) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData(['students']);
      queryClient.setQueryData(['students'], (old: Student[] = []) => 
        old.filter(student => student.id !== deletedStudentId)
      );
      return { previousStudents };
    },
    onError: (err, deletedStudentId, context) => {
      console.error("Delete error:", err);
      queryClient.setQueryData(['students'], context?.previousStudents);
      toast({
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      closeDialog();
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students,
    saveStudent,
    deleteStudent,
    isLoading,
    error
  };
}