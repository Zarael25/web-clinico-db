'use client'

import { useEffect, useState } from 'react'
import { getAtencionesByEstudiante } from '@/services/atenciones'

type HistorialAtencionesProps = {
  estudianteId: string
  token: string
}

export default function HistorialAtenciones({ estudianteId, token }: HistorialAtencionesProps) {
  const [atenciones, setAtenciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <p className="text-center text-[var(--foreground)]/70">Cargando historial...</p>
  }

  if (atenciones.length === 0) {
    return <p className="text-center text-[var(--foreground)]/70">No hay atenciones registradas</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">Historial Clínico</h2>

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

          <p className="text-sm">
            <strong>Sugerir baja:</strong>{' '}
            {atencion.sugerir_baja ? (
              <span className="text-[var(--error)]">Sí</span>
            ) : (
              <span className="text-[var(--success)]">No</span>
            )}
          </p>
        </div>
      ))}
    </div>
  )
}
