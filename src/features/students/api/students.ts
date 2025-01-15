import { supabase } from '@/services/api/supabase';
import { Student } from '@/types/calendar';

export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*');
    
  if (error) throw error;
  return data;
};

export const createStudent = async (student: Omit<Student, 'id'>) => {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// ... diğer API fonksiyonları