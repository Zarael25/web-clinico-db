import { ENDPOINTS } from '@/config/api'

// Crear una nueva atención médica
export async function crearAtencion(
  estudianteId: string,
  motivo_consulta: string,
  diagnostico: string,
  tratamiento: string,
  sugerir_baja: boolean,
  token: string,
  medicamentosAdministrados: { medicamento: string; dosis: string; via: string }[] = []
) {
  const response = await fetch(ENDPOINTS.ATENCIONES.CREATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      estudiante: estudianteId,
      motivo_consulta,
      diagnostico,
      tratamiento,
      sugerir_baja,
      medicamentosAdministrados,
    }),
  })

  if (!response.ok) {
    throw new Error('Error al crear la atención médica')
  }

  return response.json()
}

// Listar atenciones de un estudiante
export async function getAtencionesByEstudiante(estudianteId: string, token: string) {
  const response = await fetch(ENDPOINTS.ATENCIONES.POR_ESTUDIANTE(estudianteId), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener las atenciones del estudiante')
  }

  return response.json()
}

// Obtener detalle de una atención
export async function getAtencionDetalle(atencionId: string, token: string) {
  const response = await fetch(ENDPOINTS.ATENCIONES.DETALLE(atencionId), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el detalle de la atención')
  }

  return response.json()
}
