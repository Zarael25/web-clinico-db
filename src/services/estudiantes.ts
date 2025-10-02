/**
 * Descripción:
 *   Servicios para la gestión de estudiantes en el sistema clínico.
 *   Incluyen la búsqueda por nombre/criterios y la obtención de un estudiante específico.
 *
 * Funciones:
 *
 *   buscarEstudiantes(q, token):
 *     - GET → /v1/estudiantes/buscar?q={query}
 *     - Busca estudiantes por nombre, apellido, curso o RUDE.
 *     - Parámetros:
 *         q (string): Texto de búsqueda (se envía codificado en URL).
 *         token (string): JWT de autenticación.
 *     - Retorna un array de objetos estudiante.
 *     - Ejemplo de uso:
 *         const lista = await buscarEstudiantes('Valeria', token)
 *
 *   getEstudianteById(id, token):
 *     - GET → /v1/estudiantes/:id
 *     - Obtiene el detalle de un estudiante por su ID en la base de datos.
 *     - Parámetros:
 *         id (string): Identificador único del estudiante.
 *         token (string): JWT de autenticación.
 *     - Retorna un objeto estudiante con sus datos completos.
 *     - Ejemplo de uso:
 *         const estudiante = await getEstudianteById('64f...', token)
 *
 * Características:
 *   - Todas las funciones requieren `token` válido.
 *   - Manejan errores lanzando `Error` si la respuesta no es `ok`.
 *   - Se apoyan en los endpoints definidos en `config/api.ts`.
 *   - Respuestas JSON listas para usarse en componentes React/Next.js.
 *
 */

import { ENDPOINTS } from '@/config/api'

export async function buscarEstudiantes(q: string, token: string) {
  const response = await fetch(
    `${ENDPOINTS.ESTUDIANTES.BUSCAR}?q=${encodeURIComponent(q)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Error al buscar estudiantes')
  }

  return response.json()
}


export async function getEstudianteById(id: string, token: string) {
  const response = await fetch(ENDPOINTS.ESTUDIANTES.DETALLE(id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener estudiante')
  }

  return response.json()
}