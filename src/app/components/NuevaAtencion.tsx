'use client'

type NuevaAtencionProps = {
  alergias?: string[]
  condicion?: string
  vacunas?: string[]
  onAgregarClick: () => void  // <-- agregas esta prop
}

export default function NuevaAtencion({
  alergias = [],
  condicion = '',
  vacunas = [],
  onAgregarClick,           // <-- la recibes aquí
}: NuevaAtencionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-primary mb-4">Nueva Atención</h2>

      <div className="bg-background border border-border rounded-xl shadow-sm p-5 space-y-4">
        <div>
          <h3 className="font-subtitulo text-foreground mb-1">Alergias</h3>
          {alergias.length > 0 ? (
            <ul className="list-disc list-inside text-parrafo text-foreground">
              {alergias.map((alergia, i) => (
                <li key={i}>{alergia}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No hay alergias registradas.</p>
          )}
        </div>

        <div>
          <h3 className="font-subtitulo text-foreground mb-1">Condición base</h3>
          <p className="text-parrafo text-foreground">{condicion || 'No hay condición base registrada.'}</p>
        </div>

        <div>
          <h3 className="font-subtitulo text-foreground mb-1">Vacunas</h3>
          {vacunas.length > 0 ? (
            <ul className="list-disc list-inside text-parrafo text-foreground">
              {vacunas.map((vacuna, i) => (
                <li key={i}>{vacuna}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No hay vacunas registradas.</p>
          )}
        </div>

        <button
          type="button"
          className="mt-4 bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
          onClick={onAgregarClick}  // <-- aquí llamas la función
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
