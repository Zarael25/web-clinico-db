import { ENDPOINTS } from '@/config/api'

// 📌 Obtener todos los medicamentos
export async function getMedicamentos(token: string) {
  const response = await fetch(ENDPOINTS.MEDICAMENTOS.LIST, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store', // 👈 evita cachear en Next.js
  })

  if (!response.ok) {
    throw new Error('Error al obtener los medicamentos')
  }

  return response.json()
}

// 📌 Crear un medicamento
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

// 📌 Actualizar un medicamento
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
