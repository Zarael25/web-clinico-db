/**
 * Descripción:
 *   Servicios para la gestión de medicamentos en el sistema clínico.
 *   Incluyen operaciones de listado, creación y actualización de medicamentos.
 *
 * Funciones:
 *
 *   getMedicamentos(token):
 *     - GET → /v1/medicamentos/
 *     - Obtiene la lista completa de medicamentos registrados en el sistema.
 *     - Parámetros:
 *         token (string): JWT de autenticación.
 *     - Retorna un array de objetos medicamento.
 *     - Ejemplo:
 *         const lista = await getMedicamentos(token)
 *
 *
 *   createMedicamento(token, data):
 *     - POST → /v1/medicamentos/
 *     - Crea un nuevo medicamento en la base de datos.
 *     - Parámetros:
 *         token (string): JWT de autenticación.
 *         data (object):
 *            - nombre_comercial (string): Nombre de marca del medicamento.
 *            - nombre_generico (string): Nombre genérico oficial.
 *            - presentacion (string): Forma de presentación (ej: tabletas, jarabe).
 *     - Retorna el objeto medicamento recién creado.
 *     - Ejemplo:
 *         await createMedicamento(token, {
 *           nombre_comercial: "Paracetamol",
 *           nombre_generico: "Acetaminofén",
 *           presentacion: "500mg tableta"
 *         })
 *
 *
 *   updateMedicamento(token, id, data):
 *     - PATCH → /v1/medicamentos/:id
 *     - Actualiza parcialmente los datos de un medicamento existente.
 *     - Parámetros:
 *         token (string): JWT de autenticación.
 *         id (string): Identificador único del medicamento.
 *         data (object opcional):
 *            - nombre_comercial (string)
 *            - nombre_generico (string)
 *            - presentacion (string)
 *     - Retorna el medicamento actualizado.
 *     - Ejemplo:
 *         await updateMedicamento(token, "64fabc123", {
 *           presentacion: "Jarabe 250ml"
 *         })
 *
 * Características:
 *   - Todas las funciones requieren un `token` válido (Bearer).
 *   - Manejo de errores con `throw new Error` si la respuesta HTTP no es `ok`.
 *   - Se usa `cache: 'no-store'` en `getMedicamentos` para evitar datos obsoletos.
 *   - Respuestas en formato JSON listas para usarse en componentes React/Next.js.
 *
 */

import { ENDPOINTS } from '@/config/api'


export async function getMedicamentos(token: string) {
  const response = await fetch(ENDPOINTS.MEDICAMENTOS.LIST, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store', 
  })

  if (!response.ok) {
    throw new Error('Error al obtener los medicamentos')
  }

  return response.json()
}


export async function createMedicamento(
  token: string,
  data: {
    nombre_comercial: string
    nombre_generico: string
    presentacion: string
  }
) {
  const response = await fetch(ENDPOINTS.MEDICAMENTOS.LIST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al crear el medicamento')
  }

  return response.json()
}


export async function updateMedicamento(
  token: string,
  id: string,
  data: {
    nombre_comercial?: string
    nombre_generico?: string
    presentacion?: string
  }
) {
  const response = await fetch(ENDPOINTS.MEDICAMENTOS.DETALLE(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el medicamento')
  }

  return response.json()
}
