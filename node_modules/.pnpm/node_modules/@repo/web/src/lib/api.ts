/**
 * Cliente API Base para el Frontend
 * Conectará con NEXT_PUBLIC_API_URL asegurando cabeceras y manejo de errores consistente.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Para el MVP hardcodeamos al usuario "encendido"
export const CURRENT_USER_EMAIL = 'ricardo@acme.com';
export const CURRENT_ORG_ID = 'acme-corp'; // Slug as ID roughly for demo, wait real Org ID is UUID.
// Actually, let's just let the backend resolve emails for the MVP.

export const api = {
  async get(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
};
