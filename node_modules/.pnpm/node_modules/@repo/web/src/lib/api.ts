/**
 * Cliente API Base para el Frontend
 * Conectará con NEXT_PUBLIC_API_URL asegurando cabeceras y manejo de errores consistente.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Ya no hay usuario hardcodeado, dependemos del token JWT (excepto para Server Components estáticos temporales)
export const CURRENT_ORG_ID = 'acme-corp'; // Tenant ID fijo para el MVP
export const CURRENT_USER_EMAIL = 'ricardo@acme.com'; // Temporero para no romper los Server Components actuales
export const api = {
  async get(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async post(endpoint: string, body: any, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }
};
