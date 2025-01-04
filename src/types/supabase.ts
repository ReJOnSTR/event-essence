export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          color: string | null
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          price?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          description: string | null
          start: string
          end: string
          student_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start: string
          end: string
          student_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start?: string
          end?: string
          student_id?: string | null
          created_at?: string
        }
      }
    }
  }
}