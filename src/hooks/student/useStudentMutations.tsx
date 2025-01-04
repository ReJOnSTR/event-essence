import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveStudent = async (student: Student) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("students")
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
      console.error("Error saving student:", error);
      throw error;
    }

    return data;
  };

  const deleteStudent = async (studentId: string) => {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", studentId);

    if (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

  const saveMutation = useMutation({
    mutationFn: saveStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Başarılı",
        description: "Öğrenci kaydedildi.",
      });
    },
    onError: (error: any) => {
      console.error("Error saving student:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Başarılı",
        description: "Öğrenci silindi.",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting student:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Öğrenci silinirken bir hata oluştu.",
      });
    },
  });

  return {
    saveStudent: saveMutation.mutate,
    deleteStudent: deleteMutation.mutate,
  };
}