'use client'

type DatosPersonalesProps = {
  estudiante: any
  condicionBase?: any
}

export default function DatosPersonales({ estudiante, condicionBase }: DatosPersonalesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">
        Datos Personales
      </h2>

      {/* Tutores */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-subtitulo text-[var(--foreground)] mb-4">Tutores</h3>
        {estudiante?.tutores?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {estudiante.tutores.map((tutor: any, idx: number) => (
              <div
                key={idx}
                className="p-4 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] min-w-[150px]"
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
          <p className="text-sm text-[var(--foreground)]/70">No hay tutores registrados</p>
        )}
      </div>

      {/* Condición base */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">Condición base</h3>
          <button
            className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                       hover:bg-[var(--secondary)] transition-colors ml-2"
          >
            Editar
          </button>
        </div>




        {condicionBase?.condicion ? (
          <div className="inline-block px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm">
            {condicionBase.condicion}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registrada</p>
        )}
      </div>

      {/* Alergias */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">Alergias</h3>
          <button
            className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                       hover:bg-[var(--secondary)] transition-colors ml-2"
          >
            Editar
          </button>
        </div>


        {condicionBase?.alergias?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {condicionBase.alergias.map((a: any, idx: number) => (
              <div
                key={idx}
                className="px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm"
              >
                {a.alergia}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registradas</p>
        )}

      </div>

      {/* Vacunas */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">Vacunas</h3>
          <button
            className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                       hover:bg-[var(--secondary)] transition-colors ml-2"
          >
            Editar
          </button>
        </div>

        {condicionBase?.vacunas?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {condicionBase.vacunas.map((v: any, idx: number) => (
              <div
                key={idx}
                className="px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm"
              >
                {v.vacuna}
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
