import { useState } from 'react';
import { uploadImage, deleteImage, getImage } from '@/services/image';
import { Image } from '@/entities/image';

export const useImageUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (entityType: string, entityId: number, file: File): Promise<Image | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadImage(entityType, entityId, file);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { upload, isLoading, error };
};

export const useImageDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (entityType: string, entityId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteImage(entityType, entityId);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { remove, isLoading, error };
};
