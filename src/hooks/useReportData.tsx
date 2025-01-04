import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lesson, Student } from "@/types/calendar";

export const useReportData = (
  selectedStudent: string,
  selectedPeriod: string,
  selectedDate: Date,
  startDate?: Date,
  endDate?: Date
) => {
  // Lessons query
  const lessonsQuery = useQuery({
    queryKey: ['lessons', selectedStudent, selectedPeriod, selectedDate, startDate, endDate],
    queryFn: async () => {
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      return lessons.map(lesson => ({
        ...lesson,
        start: new Date(lesson.start_time),
        end: new Date(lesson.end_time),
        studentId: lesson.student_id
      })) as Lesson[];
    }
  });

  // Students query
  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      return students as Student[];
    }
  });

  return {
    lessons: lessonsQuery.data || [],
    students: studentsQuery.data || [],
    isLoading: lessonsQuery.isLoading || studentsQuery.isLoading,
    error: lessonsQuery.error || studentsQuery.error
  };
};