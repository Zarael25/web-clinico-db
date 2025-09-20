'use client'

import CondicionBaseDetalle from './CondicionBaseDetalle'

type NuevaAtencionProps = {
  alergias?: { alergia: string }[] | string[]
  condicion?: string
  vacunas?: { vacuna: string }[] | string[]
  onAgregarClick: () => void
}

export default function NuevaAtencion({
  alergias = [],
  condicion = '',
  vacunas = [],
  onAgregarClick,
}: NuevaAtencionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">
        Nueva Atención
      </h2>

      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5 space-y-4">
        {/* Reutilizamos CondicionBaseDetalle */}
        <CondicionBaseDetalle
          condicion={condicion}
          alergias={alergias}
          vacunas={vacunas}
        />

        <button
          type="button"
          className="mt-4 bg-[var(--primary)] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[var(--secondary)] transition-colors"
          onClick={onAgregarClick}
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
