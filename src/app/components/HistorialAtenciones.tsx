/**
 * Descripción:
 *   Componente que muestra el historial clínico de un estudiante.
 *   Lista todas las atenciones médicas registradas, con información básica 
 *   (motivo, diagnóstico, tratamiento y sugerencia de baja).
 *   Si el usuario tiene rol adecuado, permite abrir el detalle completo de cada atención.
 *
 * Props:
 *   - estudianteId (string): ID del estudiante al que pertenecen las atenciones.
 *   - token (string): Token JWT de autenticación.
 *   - onVerDetalle (function): Callback que recibe el ID de una atención seleccionada 
 *                              para mostrar su detalle en el componente padre.
 *
 * Flujo:
 *   1. Al montar, obtiene el usuario desde `localStorage` para validar roles.
 *   2. Llama a `getAtencionesByEstudiante(estudianteId, token)` para traer 
 *      todas las atenciones del estudiante.
 *   3. Muestra estado de carga mientras se obtiene la información.
 *   4. Si no hay atenciones registradas → muestra mensaje "No hay atenciones registradas".
 *   5. Renderiza cada atención en una tarjeta con:
 *        - Motivo de consulta
 *        - Diagnóstico
 *        - Tratamiento
 *        - Indicador de sugerencia de baja
 *   6. Si el usuario tiene rol `admin` o `enfermeria` → muestra el botón "Ver detalles".
 *      Al hacer clic se ejecuta `onVerDetalle(atencion._id)`.
 *
 * Características:
 *   - Control de permisos mediante roles.
 *   - Fechas convertidas a formato local de Bolivia (`es-BO`) con zona horaria `America/La_Paz`.
 *   - Diseño responsivo con Tailwind, consistente con los demás componentes clínicos.
 *   - Diferenciación visual de "Sugerir baja" con colores de estado (`--error` y `--success`).
 *
 * Uso:
 *   <HistorialAtenciones 
 *      estudianteId="12345"
 *      token={token}
 *      onVerDetalle={(id) => setAtencionSeleccionada(id)}
 *   />
 */

'use client'

import { useEffect, useState } from 'react'
import { getAtencionesByEstudiante, descargarReporteEstudiante } from '@/services/atenciones'

type HistorialAtencionesProps = {
  estudianteId: string
  token: string
  onVerDetalle: (id: string) => void
}

export default function HistorialAtenciones({ estudianteId, token, onVerDetalle }: HistorialAtencionesProps) {
  const [atenciones, setAtenciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  const [descargando, setDescargando] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario')
    if (storedUser) {
      setUsuario(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (estudianteId && token) {
      getAtencionesByEstudiante(estudianteId, token)
        .then((data) => {
          setAtenciones(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('❌ Error cargando atenciones:', err)
          setLoading(false)
        })
    }
  }, [estudianteId, token])

  const convertirFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleString('es-BO', {
      timeZone: 'America/La_Paz',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDescargarPDF = async () => {
    try {
      setDescargando(true)
      const blob = await descargarReporteEstudiante(estudianteId, token)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte_estudiante_${estudianteId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error('❌ Error al descargar el PDF:', err)
      alert('No se pudo generar el reporte PDF.')
    } finally {
      setDescargando(false)
    }
  }

  if (loading) {
    return <p className="text-center text-[var(--foreground)]/70">Cargando historial...</p>
  }

  if (atenciones.length === 0) {
    return <p className="text-center text-[var(--foreground)]/70">No hay atenciones registradas</p>
  }

  const puedeVerDetalles = usuario?.roles?.some((rol: string) => ['admin', 'enfermeria'].includes(rol))

  return (
    <div className="space-y-4">
      {/* Encabezado con botón */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-titulo text-[var(--primary)]">Historial Clínico</h2>
        <button
          onClick={handleDescargarPDF}
          disabled={descargando}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[var(--secondary)] transition-colors disabled:opacity-70"
        >
          {descargando ? (
            <span className="animate-pulse">Generando...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 0l-4 4m4-4l4 4m-9 8h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Descargar PDF
            </>
          )}
        </button>
      </div>

      {/* Listado de atenciones */}
      {atenciones.map((atencion) => (
        <div
          key={atencion._id}
          className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Motivo: {atencion.motivo_consulta}
            </h3>
            <span className="text-sm text-[var(--info)]">
              {convertirFecha(atencion.fecha)}
            </span>
          </div>

          <p className="text-sm mb-1">
            <strong>Diagnóstico:</strong> {atencion.diagnostico}
          </p>

          <p className="text-sm mb-1">
            <strong>Tratamiento:</strong> {atencion.tratamiento}
          </p>

          <p className="text-sm mb-3">
            <strong>Sugerir baja:</strong>{' '}
            {atencion.sugerir_baja ? (
              <span className="text-[var(--error)]">Sí</span>
            ) : (
              <span className="text-[var(--success)]">No</span>
            )}
          </p>

          {/* Mostrar botón solo si el usuario es admin o enfermeria */}
          {puedeVerDetalles && (
            <button
              onClick={() => onVerDetalle(atencion._id)}
              className="mt-2 bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[var(--secondary)] transition-colors"
            >
              Ver detalles
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
