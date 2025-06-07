import { Role } from '../role';

export type User = {
  id: number;
  username: string;
  name: string;
  password: string;
  role: Role;
  isEnabled: boolean;
  error?: string;
};
