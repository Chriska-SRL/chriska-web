type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const getHeaders = (withAuth: boolean): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token no disponible');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const request = async <T>(method: Method, url: string, body?: any, withAuth: boolean = true): Promise<T> => {
  const res = await fetch(url, {
    method,
    headers: getHeaders(withAuth),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error desconocido');
  }

  return await res.json();
};

export const get = <T>(url: string, withAuth = true) => request<T>('GET', url, undefined, withAuth);
export const post = <T>(url: string, data: any, withAuth = true) => request<T>('POST', url, data, withAuth);
export const put = <T>(url: string, data: any, withAuth = true) => request<T>('PUT', url, data, withAuth);
export const del = <T>(url: string, withAuth = true) => request<T>('DELETE', url, undefined, withAuth);
