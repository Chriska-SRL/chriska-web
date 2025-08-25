type Coordinates = {
  latitude: number;
  longitude: number;
};

let cachedLocation: Coordinates | null = null;
let locationPromise: Promise<Coordinates> | null = null;

const getDefaultCoordinates = (): Coordinates => ({
  latitude: 0,
  longitude: 0,
});

const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        cachedLocation = coords;
        resolve(coords);
      },
      (error) => {
        console.warn('Error getting location:', error.message);
        // En caso de error, usar coordenadas por defecto
        const defaultCoords = getDefaultCoordinates();
        cachedLocation = defaultCoords;
        resolve(defaultCoords);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 300000, // 5 minutos de cache
      },
    );
  });
};

export const getUserLocation = async (): Promise<Coordinates> => {
  // Si tenemos ubicación en cache y es reciente, la devolvemos
  if (cachedLocation) {
    return cachedLocation;
  }

  // Si ya hay una promesa pendiente, la esperamos
  if (locationPromise) {
    return locationPromise;
  }

  // Crear nueva promesa para obtener ubicación
  locationPromise = getCurrentPosition();

  try {
    const location = await locationPromise;
    return location;
  } finally {
    locationPromise = null;
  }
};

export const getLocationSync = (): Coordinates => {
  return cachedLocation || getDefaultCoordinates();
};

// Función para inicializar la ubicación al cargar la app
export const initializeLocation = () => {
  if (typeof window !== 'undefined') {
    getUserLocation().catch(() => {
      // Silently fail, will use default coordinates
    });
  }
};
