/**
 * Descripción:
 *   Servicios para la gestión de tutores en el sistema clínico.
 *   Permiten listar, crear, actualizar y asignar tutores a estudiantes.
 *
 * Funciones:
 *
 *   getTutores(token):
 *     - GET → /v1/tutores/
 *     - Obtiene la lista de todos los tutores registrados (sin estudiantes asociados).
 *     - Parámetros:
 *         token (string): JWT de autenticación.
 *     - Retorna un array de tutores.
 *     - Ejemplo:
 *         const lista = await getTutores(token)
 *
 *
 *   getTutoresConEstudiantes(token):
 *     - GET → /v1/tutores/con-estudiantes
 *     - Obtiene la lista de tutores junto con los estudiantes asignados.
 *     - Parámetros:
 *         token (string): JWT de autenticación.
 *     - Retorna un array de tutores con propiedad `estudiantes: []`.
 *
 *
 *   getTutorById(id, token):
 *     - GET → /v1/tutores/:id
 *     - Obtiene los datos de un tutor específico, con su detalle y estudiantes.
 *     - Parámetros:
 *         id (string): ID único del tutor.
 *         token (string): JWT de autenticación.
 *     - Retorna un objeto tutor.
 *
 *
 *   createTutor(tutorData, token):
 *     - POST → /v1/tutores/
 *     - Crea un nuevo tutor en la base de datos.
 *     - Parámetros:
 *         tutorData (object): Información del tutor (nombre, apellido, carnet, parentesco, celular, etc.).
 *         token (string): JWT de autenticación.
 *     - Retorna el tutor recién creado.
 *
 *
 *   updateTutor(id, tutorData, token):
 *     - PATCH → /v1/tutores/:id
 *     - Actualiza parcialmente los datos de un tutor existente.
 *     - Parámetros:
 *         id (string): ID del tutor.
 *         tutorData (object): Campos a actualizar.
 *         token (string): JWT de autenticación.
 *     - Retorna el tutor actualizado.
 *
 *
 *   addEstudianteToTutor(tutorId, estudianteId, token):
 *     - POST → /v1/tutores/:id/add-estudiante
 *     - Asigna un estudiante a un tutor.
 *     - Parámetros:
 *         tutorId (string): ID del tutor.
 *         estudianteId (string): ID del estudiante.
 *         token (string): JWT de autenticación.
 *     - Retorna el tutor actualizado con el nuevo estudiante agregado.
 *
 *
 *   removeEstudianteFromTutor(tutorId, estudianteId, token):
 *     - DELETE → /v1/tutores/:id/remove-estudiante/:estudianteId
 *     - Elimina la relación entre un tutor y un estudiante.
 *     - Parámetros:
 *         tutorId (string): ID del tutor.
 *         estudianteId (string): ID del estudiante a remover.
 *         token (string): JWT de autenticación.
 *     - Retorna el tutor actualizado sin el estudiante.
 *
 * Características:
 *   - Todas las funciones requieren un `token` válido (Bearer).
 *   - Manejo de errores con `throw new Error` en respuestas no `ok`.
 *   - Compatible con los componentes React/Next.js que consumen el backend.
 *
 */



import { ENDPOINTS } from '@/config/api'


export async function getTutores(token: string) {
  const response = await fetch(ENDPOINTS.TUTORES.LIST, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los tutores')
  }

  return response.json()
}


export async function getTutoresConEstudiantes(token: string) {
  const response = await fetch(ENDPOINTS.TUTORES.CON_ESTUDIANTES, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los tutores con estudiantes')
  }

  return response.json()
}


export async function getTutorById(id: string, token: string) {
  const response = await fetch(ENDPOINTS.TUTORES.DETALLE(id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el tutor')
  }

  return response.json()
}


export async function createTutor(tutorData: any, token: string) {
  const response = await fetch(ENDPOINTS.TUTORES.LIST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tutorData),
  })

  if (!response.ok) {
    throw new Error('Error al crear el tutor')
  }

  return response.json()
}


export async function updateTutor(id: string, tutorData: any, token: string) {
  const response = await fetch(ENDPOINTS.TUTORES.EDITAR(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tutorData),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el tutor')
  }

  return response.json()
}


export async function addEstudianteToTutor(tutorId: string, estudianteId: string, token: string) {
  const response = await fetch(ENDPOINTS.TUTORES.ADD_ESTUDIANTE(tutorId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estudianteId }),
  })

  if (!response.ok) {
    throw new Error('Error al agregar estudiante al tutor')
  }

  return response.json()
}


export async function removeEstudianteFromTutor(
  tutorId: string,
  estudianteId: string,
  token: string
) {
  const response = await fetch(ENDPOINTS.TUTORES.REMOVE_ESTUDIANTE(tutorId, estudianteId), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al remover estudiante del tutor')
  }

  return response.json()
}
