import { useEffect, useState } from 'react';
import { FieldError, Result } from './result';
import { User } from '@/entities/user';
import { getUsers, addUser, updateUser, deleteUser, passwordReset } from '@/services/user';
import { PasswordReset } from '@/entities/password-reset/password-reset';

export const useGetUsers = (): Result<User[]> => {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getUsers();
        setData(result);
        setError(undefined);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
        setData([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

export const useAddUser = (props?: Partial<User>): Result<User> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<User>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await addUser(props);
          setData(result);
          setError(undefined);
          setFieldError(undefined);
        } catch (err: any) {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.campo && parsed?.error) {
              setFieldError(parsed);
              setError(undefined);
            } else {
              setError(err.message || 'Error desconocido');
              setFieldError(undefined);
            }
          } catch {
            setError(err.message || 'Error desconocido');
            setFieldError(undefined);
          }
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [props]);

  return { data, isLoading, error, fieldError };
};

export const useUpdateUser = (props?: Partial<User>): Result<User> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<User>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await updateUser(props);
          setData(result);
          setError(undefined);
          setFieldError(undefined);
        } catch (err: any) {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.campo && parsed?.error) {
              setFieldError(parsed);
              setError(undefined);
            } else {
              setError(err.message || 'Error desconocido');
              setFieldError(undefined);
            }
          } catch {
            setError(err.message || 'Error desconocido');
            setFieldError(undefined);
          }
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [props]);

  return { data, isLoading, error, fieldError };
};

export const useDeleteUser = (id?: number): Result<User> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<User>();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await deleteUser(id);
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [id]);

  return { data, isLoading, error };
};

export const usePasswordReset = (props?: PasswordReset): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (!props) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);
      setFieldError(undefined);

      try {
        await passwordReset(props);
        setData(true);
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
      }

      setIsLoading(false);
    };

    fetchData();
  }, [props]);

  return { data, isLoading, error, fieldError };
};
