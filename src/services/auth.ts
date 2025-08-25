import { ENDPOINTS } from '@/config/api';

export async function loginUsuario(carnet: string, password: string) {
  const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carnet, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en login');
  }

  return response.json();
}