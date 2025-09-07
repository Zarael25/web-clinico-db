import { ENDPOINTS } from '@/config/api'


// Obtener condición base por estudiante
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


// Editar condición base
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



// Obtener alergias de un estudiante
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

// Actualizar todas las alergias (PUT)
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


// Obtener vacunas de un estudiante
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

// Actualizar todas las vacunas (PUT)
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