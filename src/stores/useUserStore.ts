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
  tempPassword?: string; // Nueva propiedad para la contraseña temporal
  setUserFromToken: (token: string) => void;
  hasPermission: (Permission: number) => boolean;
  logout: () => void;
  initializeFromStorage: () => void;
  setTempPassword: (password: string) => void; // Nueva función
  clearTempPassword: () => void; // Nueva función
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

    if (isDev) {
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    } else {
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
  tempPassword: undefined, // Inicializar la contraseña temporal

  setUserFromToken: (token) => {
    const decoded = decodeToken(token);
    if (decoded) {
      const numericPermissions = decoded.permissions.map((p) => parseInt(p));

      setCookie('auth-token', token);

      // Preservar la contraseña temporal al actualizar el usuario
      const currentState = get();
      set({
        user: decoded,
        permissions: numericPermissions,
        isLoggedIn: true,
        isHydrated: true,
        tempPassword: currentState.tempPassword, // ← PRESERVAR la contraseña temporal
      });
    } else {
      deleteCookie('auth-token');
      set({
        user: null,
        permissions: [],
        isLoggedIn: false,
        isHydrated: true,
        tempPassword: undefined, // Limpiar contraseña temporal en caso de error
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
      tempPassword: undefined, // Limpiar contraseña temporal al hacer logout
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
          tempPassword: undefined, // Limpiar contraseña temporal si el token es inválido
        });
      }
    } else {
      set({
        user: null,
        permissions: [],
        isLoggedIn: false,
        isHydrated: true,
        tempPassword: undefined, // Limpiar contraseña temporal si no hay token
      });
    }
  },

  // Nuevas funciones para manejar la contraseña temporal
  setTempPassword: (password: string) => {
    set({ tempPassword: password });
  },

  clearTempPassword: () => {
    set({ tempPassword: undefined });
  },
}));
