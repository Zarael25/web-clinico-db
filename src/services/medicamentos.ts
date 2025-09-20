import { ENDPOINTS } from '@/config/api'

export async function getMedicamentos(token: string) {
  const response = await fetch(`${ENDPOINTS.MEDICAMENTOS.LIST}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los medicamentos')
  }

  return response.json()
}