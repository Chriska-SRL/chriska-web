import { useState, useEffect } from 'react';
import { User } from '@/entities/user';

const API_URL = "http://192.168.0.197:5291/api/Users" //process.env.NEXT_PUBLIC_API_URL + '/api/Users';

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado');
      setIsLoading(false);
      return;
    }

    fetch(API_URL, {
      headers: getAuthHeaders(token),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error de autenticación');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Respuesta inválida del servidor');
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { users, isLoading, error };
};
