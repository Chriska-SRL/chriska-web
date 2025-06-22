import { post } from '@/utils/fetcher';
import { AccessToken } from '@/entities/access-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = (username: string, password: string): Promise<AccessToken> => {
  return post<AccessToken>(`${API_URL}/Auth/login`, { username, password }, false);
};
