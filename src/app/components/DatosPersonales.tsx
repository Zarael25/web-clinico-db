'use client'

export default function DatosPersonales() {
  const secciones = [
    { titulo: 'Tutores' },
    { titulo: 'Condición base' },
    { titulo: 'Alergias' },
    { titulo: 'Vacunas' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-primary mb-4">Datos Personales</h2>

      {secciones.map((seccion) => (
        <div
          key={seccion.titulo}
          className="bg-background border border-border rounded-xl shadow-sm p-5"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-subtitulo text-foreground">{seccion.titulo}</h3>
            <button
              className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                         hover:bg-secondary transition-colors"
            >
              Añadir
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}