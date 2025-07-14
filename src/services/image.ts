import { Image } from '@/entities/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
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
