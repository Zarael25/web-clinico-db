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


// Listar atenciones por fecha
export async function getAtencionesByFecha(fecha: string, token: string) {
  const url = ENDPOINTS.ATENCIONES.POR_FECHA(fecha)

  console.log("📡 Llamando a:", url)
  console.log("🔑 Token enviado:", token ? `Bearer ${token.substring(0, 20)}...` : "VACÍO")

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.error("❌ Error status:", response.status)
    throw new Error('Error al obtener las atenciones por fecha')
  }

  return response.json()
}


// Descargar reporte PDF de atenciones
export async function descargarReporteAtenciones(
  token: string,
  anio?: string,
  mes?: string,
  dia?: string
) {
  const url = ENDPOINTS.ATENCIONES.REPORTE(anio, mes, dia)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al generar el reporte PDF')
  }

  // 👇 lo devuelve como Blob para poder descargarlo en el navegador
  const blob = await response.blob()
  return blob
}