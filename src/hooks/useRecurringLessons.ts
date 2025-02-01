import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lesson, EditMode } from '@/types/calendar';
import { addWeeks, addMonths, isBefore } from 'date-fns';

export const useRecurringLessons = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createRecurringLessons = async (
    baseLesson: Omit<Lesson, 'id'>,
    recurrenceCount: number
  ) => {
    setIsLoading(true);
    try {
      const seriesId = crypto.randomUUID();
      const lessons: Omit<Lesson, 'id'>[] = [];
      let currentDate = new Date(baseLesson.start);
      let endDate = new Date(baseLesson.end);

      for (let i = 0; i < recurrenceCount; i++) {
        if (i > 0) {
          if (baseLesson.recurrenceType === 'weekly') {
            currentDate = addWeeks(currentDate, baseLesson.recurrenceInterval || 1);
            endDate = addWeeks(endDate, baseLesson.recurrenceInterval || 1);
          } else if (baseLesson.recurrenceType === 'monthly') {
            currentDate = addMonths(currentDate, baseLesson.recurrenceInterval || 1);
            endDate = addMonths(endDate, baseLesson.recurrenceInterval || 1);
          }
        }

        lessons.push({
          ...baseLesson,
          start: currentDate,
          end: endDate,
          seriesId: i === 0 ? null : seriesId,
          sequenceNumber: i + 1,
          isRecurring: true
        });
      }

      const { data, error } = await supabase
        .from('lessons')
        .insert(
          lessons.map(lesson => ({
            title: lesson.title,
            description: lesson.description,
            start_time: lesson.start.toISOString(),
            end_time: lesson.end.toISOString(),
            student_id: lesson.studentId,
            series_id: lesson.seriesId,
            sequence_number: lesson.sequenceNumber,
            is_recurring: lesson.isRecurring,
            recurrence_type: lesson.recurrenceType,
            recurrence_interval: lesson.recurrenceInterval
          }))
        )
        .select();

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Tekrarlanan dersler oluşturuldu.",
      });

      return data;
    } catch (error) {
      console.error('Error creating recurring lessons:', error);
      toast({
        title: "Hata",
        description: "Tekrarlanan dersler oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecurringLessons = async (
    lesson: Lesson,
    updatedFields: Partial<Lesson>,
    editMode: EditMode
  ) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('lessons')
        .update({
          title: updatedFields.title,
          description: updatedFields.description,
          start_time: updatedFields.start?.toISOString(),
          end_time: updatedFields.end?.toISOString(),
          student_id: updatedFields.studentId,
        });

      if (editMode === 'single') {
        query = query.eq('id', lesson.id);
      } else if (editMode === 'future') {
        query = query
          .eq('series_id', lesson.seriesId)
          .gte('sequence_number', lesson.sequenceNumber || 1);
      } else if (editMode === 'all') {
        query = query.eq('series_id', lesson.seriesId);
      }

      const { error } = await query;

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Dersler güncellendi.",
      });
    } catch (error) {
      console.error('Error updating recurring lessons:', error);
      toast({
        title: "Hata",
        description: "Dersler güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecurringLessons = async (
    lesson: Lesson,
    editMode: EditMode
  ) => {
    setIsLoading(true);
    try {
      let query = supabase.from('lessons').delete();

      if (editMode === 'single') {
        query = query.eq('id', lesson.id);
      } else if (editMode === 'future') {
        query = query
          .eq('series_id', lesson.seriesId)
          .gte('sequence_number', lesson.sequenceNumber || 1);
      } else if (editMode === 'all') {
        query = query.eq('series_id', lesson.seriesId);
      }

      const { error } = await query;

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Dersler silindi.",
      });
    } catch (error) {
      console.error('Error deleting recurring lessons:', error);
      toast({
        title: "Hata",
        description: "Dersler silinirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRecurringLessons,
    updateRecurringLessons,
    deleteRecurringLessons,
    isLoading
  };
};