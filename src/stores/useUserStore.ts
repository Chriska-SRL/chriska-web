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
  tempPassword?: string;
  setUserFromToken: (token: string) => void;
  hasPermission: (Permission: number) => boolean;
  logout: () => void;
  initializeFromStorage: () => void;
  setTempPassword: (password: string) => void;
  clearTempPassword: () => void;
};

const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded: any = jwtDecode(token);

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return null;
    }

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

const isDev = process.env.NODE_ENV === 'development';

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== 'undefined') {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    // Enhanced cookie setting for Vercel compatibility
    const cookieString = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax${!isDev ? '; Secure' : ''}`;

    document.cookie = cookieString;
    
    // Force immediate cookie availability in document
    document.cookie = cookieString;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax`;
    document.cookie = cookieString;
  }
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isHydrated: false,
  permissions: [],
  tempPassword: undefined,

  setUserFromToken: (token) => {
    const decoded = decodeToken(token);

    if (decoded) {
      const numericPermissions = decoded.permissions.map((p) => parseInt(p));
      setCookie('auth-token', token);

      const currentState = get();
      set({
        user: decoded,
        permissions: numericPermissions,
        isLoggedIn: true,
        isHydrated: true,
        tempPassword: currentState.tempPassword,
      });
    } else {
      deleteCookie('auth-token');
      set({
        user: null,
        permissions: [],
        isLoggedIn: false,
        isHydrated: true,
        tempPassword: undefined,
      });
    }
  },

  hasPermission: (Permission: number) => {
    return get().permissions.includes(Permission);
  },

  logout: () => {
    deleteCookie('auth-token');

    set({
      user: null,
      permissions: [],
      isLoggedIn: false,
      isHydrated: true,
      tempPassword: undefined,
    });
  },

  initializeFromStorage: () => {
    if (typeof window === 'undefined') {
      set({ isHydrated: true });
      return;
    }

    const token = getCookie('auth-token');

    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const numericPermissions = decoded.permissions.map((p) => parseInt(p));
        set({
          user: decoded,
          permissions: numericPermissions,
          isLoggedIn: true,
          isHydrated: true,
        });
      } else {
        deleteCookie('auth-token');
        set({
          user: null,
          permissions: [],
          isLoggedIn: false,
          isHydrated: true,
          tempPassword: undefined,
        });
      }
    } else {
      set({
        user: null,
        permissions: [],
        isLoggedIn: false,
        isHydrated: true,
        tempPassword: undefined,
      });
    }
  },

  setTempPassword: (password: string) => {
    set({ tempPassword: password });
  },

  clearTempPassword: () => {
    set({ tempPassword: undefined });
  },
}));
