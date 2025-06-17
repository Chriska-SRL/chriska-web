import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  userId: number;
  username: string;
  name: string;
  role: string;
  permissions: string[];
  needsPasswordChange?: boolean;
  exp: number;
};

type UserStore = {
  user: TokenPayload | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  setUserFromToken: (token: string) => void;
  logout: () => void;
};

const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded: any = jwtDecode(token);
    return {
      userId: parseInt(decoded.userId),
      username: decoded.username,
      name: decoded.name,
      role: decoded.role,
      permissions: decoded.permissions ?? [],
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isHydrated: false,

  setUserFromToken: (token) => {
    const decoded = decodeToken(token);
    if (decoded) {
      localStorage.setItem('access_token', token);
      set({ user: decoded, isLoggedIn: true, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, isLoggedIn: false, isHydrated: true });
  },
}));
