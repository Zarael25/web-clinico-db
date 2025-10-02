/**
 * Descripción:
 *   Servicios relacionados con las atenciones médicas.
 *   Cada función encapsula una llamada HTTP hacia el backend,
 *   usando los endpoints centralizados en `ENDPOINTS.ATENCIONES`.
 *
 * Funciones:
 *
 *   crearAtencion(estudianteId, motivo_consulta, diagnostico, tratamiento, sugerir_baja, token, medicamentosAdministrados?):
 *     - Realiza un POST para registrar una nueva atención médica.
 *     - Recibe el ID del estudiante, datos de la consulta y lista opcional de medicamentos administrados.
 *     - Retorna el objeto de la atención creada.
 *     - Lanza un error si la API responde con estado no OK.
 *
 *   getAtencionesByEstudiante(estudianteId, token):
 *     - Obtiene todas las atenciones asociadas a un estudiante.
 *     - Llamada GET → /v1/atenciones/estudiante/:id
 *     - Retorna un array de atenciones.
 *
 *   getAtencionDetalle(atencionId, token):
 *     - Obtiene el detalle completo de una atención médica.
 *     - Llamada GET → /v1/atenciones/:id
 *     - Incluye motivo, diagnóstico, tratamiento, medicamentos, etc.
 *
 *   getAtencionesByFecha(fecha, token):
 *     - Obtiene todas las atenciones registradas en una fecha específica.
 *     - Llamada GET → /v1/atenciones/fecha?fecha=YYYY-MM-DD
 *     - Incluye logs en consola para depuración (URL generada y token parcial).
 *     - Lanza un error si la API responde con estado != 200.
 *
 *   descargarReporteAtenciones(token, anio?, mes?, dia?):
 *     - Descarga un reporte en formato PDF con las atenciones médicas.
 *     - Genera dinámicamente la URL con año, mes y/o día (filtros opcionales).
 *     - Retorna un Blob que puede ser descargado o visualizado en el navegador.
 *
 * Características:
 *   - Todas las funciones incluyen manejo de errores con `throw new Error`.
 *   - Se asegura el envío del token JWT en el header `Authorization`.
 *   - Estandarización en `Content-Type: application/json` (excepto en la descarga de PDF).
 *   - Reutilización de endpoints centralizados → evita hardcodear URLs.
 *
 */



import { ENDPOINTS } from '@/config/api'


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

  
  const blob = await response.blob()
  return blob
}