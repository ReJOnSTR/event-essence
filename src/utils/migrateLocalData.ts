import { supabase } from "@/integrations/supabase/client";

export async function migrateLocalData() {
  try {
    // Öğrenci verilerini taşı
    const localStudents = JSON.parse(localStorage.getItem('students') || '[]');
    if (localStudents.length > 0) {
      const { error: studentsError } = await supabase
        .from('students')
        .insert(localStudents.map((student: any) => ({
          id: student.id,
          name: student.name,
          color: student.color,
          price: student.price
        })));

      if (studentsError) throw studentsError;
    }

    // Ders verilerini taşı
    const localLessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    if (localLessons.length > 0) {
      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(localLessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          start_time: new Date(lesson.start).toISOString(),
          end_time: new Date(lesson.end).toISOString(),
          student_id: lesson.studentId
        })));

      if (lessonsError) throw lessonsError;
    }

    // Başarılı migrasyon sonrası localStorage'ı temizle
    localStorage.removeItem('students');
    localStorage.removeItem('lessons');

    return { success: true, error: null };
  } catch (error) {
    console.error('Veri taşıma hatası:', error);
    return { success: false, error };
  }
}