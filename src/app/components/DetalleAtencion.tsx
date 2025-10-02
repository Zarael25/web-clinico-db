/**
 * Descripción:
 *   Componente para mostrar el detalle completo de una atención médica
 *   de un estudiante. Consulta los datos desde el backend a partir del
 *   `atencionId` y renderiza toda la información de manera detallada.
 *
 * Props:
 *   - atencionId (string): ID único de la atención a consultar en el backend.
 *   - token (string): Token JWT válido para autenticar la solicitud.
 *   - onVolver (function): Callback a ejecutar al presionar el botón de regresar.
 *
 * Características:
 *   - Hace una llamada a `getAtencionDetalle(atencionId, token)` en el montaje
 *     para obtener la información desde el backend.
 *   - Renderiza:
 *       • Fecha formateada (en zona horaria "America/La_Paz").
 *       • Usuario que atendió (médico o personal de enfermería).
 *       • Motivo de consulta, diagnóstico, tratamiento.
 *       • Estado de "sugerir baja" con colores (rojo/verde).
 *       • Lista de medicamentos administrados (nombre, presentación, dosis, vía).
 *   - Incluye un botón "← Volver al historial" que dispara `onVolver()`.
 *
 * Flujo:
 *   1. Mientras carga → muestra "Cargando detalle...".
 *   2. Si falla la carga → muestra mensaje de error.
 *   3. Si carga correctamente → renderiza toda la información en secciones.
 *
 * Relación con otros componentes:
 *   - ClinicoHistorialPage: Muestra este detalle al seleccionar una atención.
 *   - AgregarAtencion: Puede redirigir a este componente después de crear una nueva atención.
 *
 * Uso:
 *   <DetalleAtencion
 *      atencionId={id}
 *      token={token}
 *      onVolver={() => setVista('historial')}
 *   />
 */

'use client'

import { useEffect, useState } from 'react'
import { getAtencionDetalle } from '@/services/atenciones'

type DetalleAtencionProps = {
  atencionId: string
  token: string
  onVolver: () => void
}

export default function DetalleAtencion({ atencionId, token, onVolver }: DetalleAtencionProps) {
  const [atencion, setAtencion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (atencionId && token) {
      getAtencionDetalle(atencionId, token)
        .then((data) => {
          setAtencion(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('❌ Error cargando detalle de atención:', err)
          setLoading(false)
        })
    }
  }, [atencionId, token])

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
    return <p className="text-center text-[var(--foreground)]/70">Cargando detalle...</p>
  }

  if (!atencion) {
    return <p className="text-center text-[var(--error)]">Error cargando la atención</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">Detalle de Atención</h2>

      <p><strong>Fecha:</strong> {convertirFecha(atencion.fecha)}</p>
      <p><strong>Atendido por:</strong> {atencion.user?.nombre || '—'}</p>
      <p><strong>Motivo:</strong> {atencion.motivo_consulta}</p>
      <p><strong>Diagnóstico:</strong> {atencion.diagnostico}</p>
      <p><strong>Tratamiento:</strong> {atencion.tratamiento}</p>
      <p>
        <strong>Sugerir baja:</strong>{' '}
        {atencion.sugerir_baja ? (
          <span className="text-[var(--error)]">Sí</span>
        ) : (
          <span className="text-[var(--success)]">No</span>
        )}
      </p>

      {/* Lista de medicamentos */}
      <div>
        <h3 className="text-lg font-semibold mt-4 mb-2">Medicamentos Administrados</h3>
        {atencion.medicamentosAdministrados?.length > 0 ? (
          <ul className="space-y-2">
            {atencion.medicamentosAdministrados.map((med: any, idx: number) => (
              <li key={idx} className="border p-2 rounded-lg">
                <p><strong>{med.medicamento.nombre_comercial}</strong> — {med.medicamento.presentacion}</p>
                <p className="text-sm">Dosis: {med.dosis}</p>
                <p className="text-sm">Vía: {med.via}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No se administraron medicamentos</p>
        )}
      </div>

      <button
        onClick={onVolver}
        className="mt-4 bg-[var(--secondary)] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
      >
        ← Volver al historial
      </button>
    </div>
  )
}
