'use client'

type CondicionBaseDetalleProps = {
  condicion?: string
  alergias?: { alergia: string }[] | string[]
  vacunas?: { vacuna: string }[] | string[]
}

export default function CondicionBaseDetalle({
  condicion = '',
  alergias = [],
  vacunas = [],
}: CondicionBaseDetalleProps) {
  return (
    <div className="space-y-4">
      {/* Condición base */}
      <div className="flex items-center gap-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-3">
        <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
          Condición base:
        </h3>
        {condicion ? (
          <div className="px-3 py-1.5 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm">
            {condicion}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registrada</p>
        )}
      </div>

      {/* Alergias */}
      <div className="flex items-center gap-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-3">
        <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
          Alergias:
        </h3>
        {(alergias?.length ?? 0) > 0 ? (
          <div className="flex flex-wrap gap-2">
            {(alergias as any[]).map((a, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm"
              >
                {typeof a === 'string' ? a : a.alergia}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registradas</p>
        )}
      </div>

      {/* Vacunas */}
      <div className="flex items-center gap-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-3">
        <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
          Vacunas:
        </h3>
        {(vacunas?.length ?? 0) > 0 ? (
          <div className="flex flex-wrap gap-2">
            {(vacunas as any[]).map((v, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm"
              >
                {typeof v === 'string' ? v : v.vacuna}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registradas</p>
        )}
      </div>
    </div>
  )
}
