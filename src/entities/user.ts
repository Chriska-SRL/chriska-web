import { Role } from "./role";

export type User = {
  id: number;
  username: string;
  name: string;
  isEnabled: boolean;
  role: Role;
};