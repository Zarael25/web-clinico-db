// services/estudiantes.ts
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

// Obtener estudiante por ID
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