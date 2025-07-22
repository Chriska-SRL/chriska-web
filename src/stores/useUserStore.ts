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
  initializeFromStorage: () => void;
};

const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded: any = jwtDecode(token);

    // Verificar si el token ha expirado
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

// Detectar si estamos en desarrollo
const isDev = process.env.NODE_ENV === 'development';

// Función para manejar cookies (adaptada para desarrollo)
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== 'undefined') {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();

    // En desarrollo, usar configuración más permisiva
    if (isDev) {
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    } else {
      // En producción, usar configuración segura
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict; Secure`;
    }
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
    if (isDev) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax`;
    } else {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Strict`;
    }
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

      setCookie('auth-token', token);

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
        });
      }
    } else {
      set({
        user: null,
        permissions: [],
        isLoggedIn: false,
        isHydrated: true,
      });
    }
  },
}));
