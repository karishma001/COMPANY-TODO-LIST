export interface Task {
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
}