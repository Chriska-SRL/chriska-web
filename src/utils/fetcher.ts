type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const getHeaders = (withAuth: boolean, isFormData: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};

  // Only set Content-Type for JSON, let browser set it for FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (withAuth) {
    const token = getCookie('auth-token');
    if (!token) {
      throw new Error('Token no disponible');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const addLocationToBody = (body: any, method: Method): any => {
  if (method !== 'POST' && method !== 'PUT') {
    return body;
  }

  // For FormData, add location as separate entries
  if (body instanceof FormData) {
    if (!body.has('latitude') && !body.has('longitude')) {
      if (typeof window !== 'undefined' && navigator.geolocation) {
        // For FormData, we'll handle location separately in the calling code
        // since it requires async operation
      } else {
        body.append('latitude', '0');
        body.append('longitude', '0');
      }
    }
    return body;
  }

  // For JSON bodies
  if (body && body.location) {
    return body;
  }

  const defaultCoords = { latitude: 0, longitude: 0 };

  if (!body) {
    return {
      location: defaultCoords,
    };
  }

  return {
    ...body,
    location: defaultCoords,
  };
};

const request = async <T>(method: Method, url: string, body?: any, withAuth: boolean = true): Promise<T> => {
  const isFormData = body instanceof FormData;
  const processedBody = addLocationToBody(body, method);

  const res = await fetch(url, {
    method,
    headers: getHeaders(withAuth, isFormData),
    body: isFormData ? processedBody : processedBody ? JSON.stringify(processedBody) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error desconocido');
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }

  if (contentType && contentType.includes('text/plain')) {
    return (await res.text()) as T;
  }

  return undefined as T;
};

export const get = <T>(url: string, withAuth = true) => request<T>('GET', url, undefined, withAuth);
export const post = <T>(url: string, data: any, withAuth = true) => request<T>('POST', url, data, withAuth);
export const put = <T>(url: string, data: any, withAuth = true) => request<T>('PUT', url, data, withAuth);
export const del = <T>(url: string, withAuth = true) => request<T>('DELETE', url, undefined, withAuth);
