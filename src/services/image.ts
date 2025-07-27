import { Image } from '@/entities/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const getHeaders = (): HeadersInit => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token no disponible');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const uploadImage = async (entityType: string, entityId: number, file: File): Promise<Image> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/Images/${entityType}/${entityId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error al subir imagen');
  }

  return response.json();
};

export const getImage = async (entityType: string, entityId: number): Promise<Image> => {
  const response = await fetch(`${API_URL}/Images/${entityType}/${entityId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error al obtener imagen');
  }

  return response.json();
};

export const deleteImage = async (entityType: string, entityId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/Images/${entityType}/${entityId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error al eliminar imagen');
  }
};
