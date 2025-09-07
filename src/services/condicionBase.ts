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