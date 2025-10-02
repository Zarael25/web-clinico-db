/**
 * Descripción:
 *   Servicios para manejar la información clínica base de los estudiantes.
 *   Incluye la condición base, alergias y vacunas dentro del modelo `CondicionBase`.
 *
 * Funciones:
 *
 *   getCondicionBaseByEstudiante(estudianteId, token):
 *     - GET → /v1/condicion-base/:id
 *     - Retorna el documento completo de condición base de un estudiante.
 *     - Requiere `token` JWT en `Authorization`.
 *
 *   editarCondicionBase(estudianteId, condicion, token):
 *     - PATCH → /v1/condicion-base/:id/condicion
 *     - Permite editar únicamente el campo `condicion`.
 *     - Retorna el objeto actualizado.
 *
 *   getAlergiasByEstudiante(estudianteId, token):
 *     - GET → /v1/condicion-base/:id/alergias
 *     - Obtiene la lista de alergias registradas de un estudiante.
 *     - Devuelve un array de `{ alergia: string }`.
 *
 *   updateAlergias(estudianteId, alergias, token):
 *     - PUT → /v1/condicion-base/:id/alergias
 *     - Sobrescribe la lista de alergias del estudiante con las enviadas.
 *     - Body esperado: `{ alergias: [{ alergia: string }] }`.
 *     - Retorna el objeto actualizado.
 *
 *   getVacunasByEstudiante(estudianteId, token):
 *     - GET → /v1/condicion-base/:id/vacunas
 *     - Obtiene la lista de vacunas registradas de un estudiante.
 *     - Devuelve un array de `{ vacuna: string }`.
 *
 *   updateVacunas(estudianteId, vacunas, token):
 *     - PUT → /v1/condicion-base/:id/vacunas
 *     - Sobrescribe la lista de vacunas del estudiante con las enviadas.
 *     - Body esperado: `{ vacunas: [{ vacuna: string }] }`.
 *     - Retorna el objeto actualizado.
 *
 * Características:
 *   - Todas las funciones requieren un `token` válido (JWT).
 *   - Están unificadas bajo la configuración de `ENDPOINTS.CONDICION_BASE`.
 *   - Manejo centralizado de errores → lanza `Error` si la petición falla.
 *   - Uso consistente de `Content-Type: application/json`.
 *
 */


import { ENDPOINTS } from '@/config/api'



export async function getCondicionBaseByEstudiante(estudianteId: string, token: string) {
  const response = await fetch(`${ENDPOINTS.CONDICION_BASE.DETALLE(estudianteId)}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener la condición base')
  }

  return response.json()
}



export async function editarCondicionBase(estudianteId: string, condicion: string, token: string) {
  const response = await fetch(ENDPOINTS.CONDICION_BASE.EDITAR(estudianteId), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ condicion }),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar la condición base')
  }

  return response.json()
}




export async function getAlergiasByEstudiante(estudianteId: string, token: string) {
  const response = await fetch(ENDPOINTS.CONDICION_BASE.ALERGIAS.GET(estudianteId), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener las alergias')
  }

  return response.json()
}


export async function updateAlergias(estudianteId: string, alergias: { alergia: string }[], token: string) {
  const response = await fetch(ENDPOINTS.CONDICION_BASE.ALERGIAS.PUT(estudianteId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ alergias }),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar las alergias')
  }

  return response.json()
}



export async function getVacunasByEstudiante(estudianteId: string, token: string) {
  const response = await fetch(ENDPOINTS.CONDICION_BASE.VACUNAS.GET(estudianteId), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener las vacunas')
  }

  return response.json()
}


export async function updateVacunas(estudianteId: string, vacunas: { vacuna: string }[], token: string) {
  const response = await fetch(ENDPOINTS.CONDICION_BASE.VACUNAS.PUT(estudianteId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ vacunas }),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar las vacunas')
  }

  return response.json()
}