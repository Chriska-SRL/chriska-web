import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  userId: number;
  username: string;
  name: string;
  role: string;
  permissions: string[];
  needsPasswordChange: boolean;
  exp: number;
};

type UserStore = {
  user: TokenPayload | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  permissions: number[];
  setUserFromToken: (token: string) => void;
  hasPermission: (Permission: number) => boolean;
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
      permissions: decoded.permission ?? [],
      needsPasswordChange: decoded.needsPasswordChange === true || decoded.needsPasswordChange === 'True',
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isHydrated: false,
  permissions: [],

  setUserFromToken: (token) => {
    const decoded = decodeToken(token);
    if (decoded) {
      const numericPermissions = decoded.permissions.map((p) => parseInt(p));
      localStorage.setItem('access_token', token);
      set({
        user: decoded,
        permissions: numericPermissions,
        isLoggedIn: true,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },

  hasPermission: (Permission: number) => {
    return get().permissions.includes(Permission);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({
      user: null,
      permissions: [],
      isLoggedIn: false,
      isHydrated: true,
    });
  },
}));
