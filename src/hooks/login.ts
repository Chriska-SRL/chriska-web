import { useState } from 'react';
import { login, getToken } from '@/services/login';
import { useUserStore } from '@/stores/useUserStore';
import { FieldError } from '../utils/result';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();

  const setUserFromToken = useUserStore((s) => s.setUserFromToken);

  const performLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(undefined);
    setFieldError(undefined);

    try {
      const result = await login(username, password);
      setUserFromToken(result.token);
      return true;
    } catch (err: any) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.campo && parsed?.error) {
          setFieldError(parsed);
        } else if (parsed?.error) {
          setError(parsed.error);
        } else {
          setError(err.message || 'Error desconocido');
        }
      } catch {
        setError(err.message || 'Error desconocido');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const performDevLogin = async () => {
    setIsLoading(true);
    setError(undefined);
    setFieldError(undefined);

    try {
      const result = await getToken();
      setUserFromToken(result.token);
      return true;
    } catch (err: any) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error) {
          setError(parsed.error);
        } else {
          setError(err.message || 'Error desconocido');
        }
      } catch {
        setError(err.message || 'Error desconocido');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    performLogin,
    performDevLogin,
    isLoading,
    error,
    fieldError,
  };
};
