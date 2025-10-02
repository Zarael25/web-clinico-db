/**
 * Descripción:
 *   Componente que prepara la creación de una nueva atención médica para un estudiante.
 *   Muestra los datos clínicos base (condición, alergias, vacunas) y un botón
 *   que permite iniciar el registro de la nueva atención.
 *
 * Props:
 *   - condicion (string, opcional): Condición base del estudiante.
 *   - alergias (array, opcional): Lista de alergias asociadas, puede venir como array de strings
 *     o de objetos con la propiedad `alergia`.
 *   - vacunas (array, opcional): Lista de vacunas registradas, puede venir como array de strings
 *     o de objetos con la propiedad `vacuna`.
 *   - onAgregarClick (function): Callback que se ejecuta al presionar el botón
 *     "Agregar Nueva Atención".
 *
 * Flujo:
 *   1. Muestra un título "Nueva Atención".
 *   2. Reutiliza el componente `CondicionBaseDetalle` para visualizar la condición base,
 *      alergias y vacunas del estudiante.
 *   3. Renderiza un botón "Agregar Nueva Atención".
 *   4. Cuando se hace clic en el botón, se ejecuta `onAgregarClick`, que normalmente
 *      redirige o cambia el estado del padre para abrir el formulario de registro.
 *
 * Características:
 *   - Usa `CondicionBaseDetalle` para mantener consistencia visual.
 *   - Interfaz simple y clara con estilos consistentes en tarjetas (`border`, `rounded-xl`, `shadow-sm`).
 *   - Botón de acción con transición de colores y estados hover.
 *
 * Uso:
 *   <NuevaAtencion
 *     condicion="Asma"
 *     alergias={[{ alergia: "Polen" }, { alergia: "Maní" }]}
 *     vacunas={[{ vacuna: "COVID-19" }]}
 *     onAgregarClick={() => setSeccionActiva('agregar')}
 *   />
 */


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
          Agregar Nueva Atención
        </button>
      </div>
    </div>
  )
}
