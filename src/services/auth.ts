/**
 * Descripción:
 *   Servicios relacionados con la autenticación de usuarios.
 *   Manejan el login y la obtención de información del usuario autenticado.
 *
 * Funciones:
 *
 *   loginUsuario(carnet, password):
 *     - Realiza un POST → /v1/auth/signin/
 *     - Envía como body `{ carnet, password }`.
 *     - Si la respuesta es exitosa:
 *         Retorna un JSON con los datos del usuario y el token JWT.
 *     - Si falla:
 *         Lanza un Error con el mensaje recibido desde la API o un mensaje genérico.
 *
 *   getMe(token):
 *     - Realiza un GET → /v1/auth/me
 *     - Requiere el token JWT en el header `Authorization: Bearer <token>`.
 *     - Retorna el objeto del usuario autenticado (nombre, roles, etc).
 *     - Si falla:
 *         Lanza un Error con el mensaje recibido desde la API o un mensaje genérico.
 *
 * Características:
 *   - Ambos métodos usan `fetch` con manejo de errores robusto.
 *   - El `token` es obligatorio en `getMe` para validar la sesión.
 *   - Los mensajes de error vienen propagados desde el backend (`errorData.message`).
 *   - Estandarización en `Content-Type: application/json`.
 *
 */



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