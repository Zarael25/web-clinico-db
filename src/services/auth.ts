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

// 🔹 Nuevo servicio para obtener los datos del usuario autenticado
export async function getMe(token: string) {
  const response = await fetch(ENDPOINTS.AUTH.ME, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'No se pudo obtener el usuario');
  }

  return response.json();
}