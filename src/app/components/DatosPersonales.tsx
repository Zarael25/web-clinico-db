'use client'

type DatosPersonalesProps = {
  estudiante: any // más adelante puedes tiparlo con una interfaz Estudiante
}

export default function DatosPersonales({ estudiante }: DatosPersonalesProps) {
  const secciones = [
    { titulo: 'Tutores' },
    { titulo: 'Condición base', valor: estudiante?.condicionBase || '—' },
    { titulo: 'Alergias', valor: estudiante?.alergias?.join(', ') || '—' },
    { titulo: 'Vacunas', valor: estudiante?.vacunas?.join(', ') || '—' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">
        Datos Personales
      </h2>

      {secciones.map((seccion) => (
        <div
          key={seccion.titulo}
          className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-subtitulo text-[var(--foreground)]">
              {seccion.titulo}
            </h3>
            <span className="text-sm text-[var(--foreground)]/80">
              {seccion.valor || ''}
            </span>
            <button
              className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                         hover:bg-[var(--secondary)] transition-colors ml-2"
            >
              Añadir
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
