/**
 * Descripción:
 *   Componente de solo visualización que muestra el detalle clínico base de un estudiante:
 *   condición, alergias y vacunas. Se utiliza en la sección de datos personales o
 *   al momento de registrar una nueva atención médica.
 *
 * Props:
 *   - condicion (string): Texto de la condición clínica base. Si no se envía, muestra "No registrada".
 *   - alergias (array): Puede ser un array de strings o de objetos con `{ alergia: string }`.
 *     Si está vacío, se muestra "No registradas".
 *   - vacunas (array): Puede ser un array de strings o de objetos con `{ vacuna: string }`.
 *     Si está vacío, se muestra "No registradas".
 *
 * Características:
 *   - Renderiza bloques con estilos consistentes (borde, sombra, badge).
 *   - Acepta flexiblemente datos en forma de string o de objeto.
 *   - No permite edición, solo visualización.
 *   - Útil como parte de otros formularios o vistas de detalle.
 *
 * Uso:
 *   <CondicionBaseDetalle
 *      condicion="Asma crónica"
 *      alergias={[{ alergia: "Polen" }, "Penicilina"]}
 *      vacunas={[{ vacuna: "Hepatitis B" }, "COVID-19"]}
 *   />
 *
 * Componente relacionado:
 *   - AgregarAtencion → usa este componente para mostrar el estado base del estudiante
 *     antes de registrar una nueva atención.
 */



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
