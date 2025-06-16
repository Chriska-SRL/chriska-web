type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const getHeaders = (withAuth = false) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = localStorage.getItem('access_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const request = async <T>(method: Method, url: string, body?: any, withAuth = false): Promise<T> => {
  const res = await fetch(url, {
    method,
    headers: getHeaders(withAuth),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error de red');
  }

  return await res.json();
};

export const get = <T>(url: string, withAuth = false) => request<T>('GET', url, undefined, withAuth);
export const post = <T>(url: string, data: any, withAuth = false) => request<T>('POST', url, data, withAuth);
export const put = <T>(url: string, data: any, withAuth = false) => request<T>('PUT', url, data, withAuth);
export const del = <T>(url: string, withAuth = false) => request<T>('DELETE', url, undefined, withAuth);
