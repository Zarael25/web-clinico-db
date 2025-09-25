import { ENDPOINTS } from '@/config/api'

// 📌 Listar todos los tutores
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

// 📌 Listar tutores con estudiantes (join manual)
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

// 📌 Obtener tutor por ID
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

// 📌 Crear tutor
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

// 📌 Editar tutor
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

// 📌 Agregar estudiante a tutor
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

// 📌 Remover estudiante de tutor
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
