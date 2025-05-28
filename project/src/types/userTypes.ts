export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'employee' | 'manager';
  created_at: string;
  updated_at: string;
}