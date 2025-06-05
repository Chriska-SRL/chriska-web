// hooks/request/user.ts
import { useState, useEffect } from 'react';
import { User } from '@/entities/user';

const API_URL = 'http://192.168.0.197:5291/api/Users';

// Función auxiliar para construir headers seguros en cliente
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Hook para obtener todos los usuarios (solo en cliente)
export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return; // evita SSR

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
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { users, isLoading, error };
};

// Obtener usuario por ID
export const getUserById = async (id: number): Promise<User | null> => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Error al obtener usuario');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Obtener usuario por username
export const getUserByUsername = async (username: string): Promise<User | null> => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/by-username/${encodeURIComponent(username)}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Usuario no encontrado');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Agregar usuario
export const addUser = async (user: User): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(user),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Actualizar usuario
export const updateUser = async (id: number, user: Partial<User>): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(user),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Eliminar usuario
export const deleteUser = async (id: number): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};
