export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lessons: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          student_id: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string | null;
          phone_number: string | null;
          teaching_subjects: string[] | null;
          years_of_experience: number | null;
        };
      };
      students: {
        Row: {
          id: string;
          name: string;
          price: number;
          color: string | null;
          created_at: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          default_lesson_duration: number | null;
          working_hours: Json | null;
          holidays: Json | null;
          allow_work_on_holidays: boolean | null;
          theme: string | null;
          font_size: string | null;
          font_family: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
    };
  };
}