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
      appointments: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          car_model: string
          preferred_date: string
          message: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          user_id: string
          request_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          car_model: string
          preferred_date: string
          message?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          user_id: string
          request_date?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          car_model?: string
          preferred_date?: string
          message?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          user_id?: string
          request_date?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}