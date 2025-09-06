'use client'

type DatosPersonalesProps = {
  estudiante: any
}

export default function DatosPersonales({ estudiante }: DatosPersonalesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">
        Datos Personales
      </h2>

      {/* Tutores */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
            Tutores
          </h3>
          <button
            className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                       hover:bg-[var(--secondary)] transition-colors"
          >
            Añadir
          </button>
        </div>

        {estudiante?.tutores?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {estudiante.tutores.map((tutor: any, idx: number) => (
              <div
                key={idx}
                className="p-4 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)]"
              >
                <h4 className="text-md font-semibold text-[var(--primary)] mb-2">
                  {tutor.nombre} {tutor.apellido}
                </h4>
                <p className="text-sm">
                  <strong>Parentesco:</strong> {tutor.parentesco}
                </p>
                <p className="text-sm">
                  <strong>Celular:</strong> {tutor.celular || '—'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">
            No hay tutores registrados
          </p>
        )}
      </div>

      {/* Condición base */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
            Condición base
          </h3>
          <span className="text-sm text-[var(--foreground)]/80">
            {estudiante?.condicionBase || '—'}
          </span>
          <button
            className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                       hover:bg-[var(--secondary)] transition-colors ml-2"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Alergias */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
            Alergias
          </h3>
          <span className="text-sm text-[var(--foreground)]/80">
            {estudiante?.alergias?.join(', ') || '—'}
          </span>
          <button
            className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                       hover:bg-[var(--secondary)] transition-colors ml-2"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Vacunas */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
            Vacunas
          </h3>
          <span className="text-sm text-[var(--foreground)]/80">
            {estudiante?.vacunas?.join(', ') || '—'}
          </span>
          <button
            className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                       hover:bg-[var(--secondary)] transition-colors ml-2"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  )
}
