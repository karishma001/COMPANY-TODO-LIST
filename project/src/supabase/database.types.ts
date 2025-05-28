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
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
          user_id: string;
          feedback: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          feedback?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          feedback?: string | null;
          completed_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'employee' | 'manager';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'employee' | 'manager';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'employee' | 'manager';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}