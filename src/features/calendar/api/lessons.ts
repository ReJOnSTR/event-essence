import { supabase } from '@/services/api/supabase';
import { Lesson } from '@/types/calendar';

export const getLessons = async () => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*');
    
  if (error) throw error;
  return data;
};

export const createLesson = async (lesson: Omit<Lesson, 'id'>) => {
  const { data, error } = await supabase
    .from('lessons')
    .insert(lesson)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// ... diğer API fonksiyonları