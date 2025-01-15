import { getStudents, createStudent } from '../api/students';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Student } from '@/types/calendar';

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents
  });

  const { mutate: addStudent } = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  return {
    students,
    isLoading,
    addStudent
  };
};