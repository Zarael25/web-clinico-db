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
