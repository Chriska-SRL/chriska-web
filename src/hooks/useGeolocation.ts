import { useEffect, useState } from 'react';
import { getUserLocation, initializeLocation } from '@/utils/geolocation';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const coords = await getUserLocation();
        setLocation(coords);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error getting location');
        setLocation({ latitude: 0, longitude: 0 });
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading, error };
};

// Hook para inicializar ubicación en el layout principal
export const useInitializeGeolocation = () => {
  useEffect(() => {
    initializeLocation();
  }, []);
};
