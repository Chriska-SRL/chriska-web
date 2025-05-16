export type User = {
  id: number;
  username: string;
  name: string;
  password: string;
  role: string;
  is_enabled: boolean;
  error?: string;
};
