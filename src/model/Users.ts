export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  is_enabled: boolean;
  created_at: Date;
  reset_password_token?: string | null;
  reset_password_expire?: Date | null;
}
