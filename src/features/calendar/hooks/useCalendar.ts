import { useState } from 'react';
import { getLessons, createLesson } from '../api/lessons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lesson } from '@/types/calendar';

export const useCalendar = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: getLessons
  });

  const { mutate: addLesson } = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    }
  });

  return {
    lessons,
    isLoading,
    selectedDate,
    setSelectedDate,
    addLesson
  };
};