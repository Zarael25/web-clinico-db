/**
 * Descripción:
 *   Modal para editar la condición base de un estudiante en el sistema clínico.
 *   Permite modificar el campo `condicion` almacenado en la colección CondicionBase
 *   asociada al estudiante.
 *
 * Props:
 *   - isOpen (boolean): Controla si el modal está abierto o cerrado.
 *   - onClose (function): Callback que se ejecuta al cerrar el modal.
 *   - estudianteId (string): ID del estudiante cuya condición base se edita.
 *   - condicionActual (string): Valor actual de la condición base (pre-cargado en el input).
 *   - token (string): Token JWT necesario para autenticar la petición al backend.
 *   - onUpdated (function): Callback que recibe la nueva condición base después de guardarse.
 *
 * Características:
 *   - Al abrir el modal (`isOpen === true`), inicializa el input con `condicionActual`.
 *   - Permite editar el texto en un input controlado por estado (`useState`).
 *   - Al guardar:
 *       → Llama al servicio `editarCondicionBase(estudianteId, condicion, token)`.
 *       → Actualiza el estado en el componente padre mediante `onUpdated`.
 *       → Cierra el modal automáticamente (`onClose`).
 *   - Maneja estados de **loading** y **error** para mostrar retroalimentación al usuario.
 *
 * Flujo:
 *   1. Usuario abre el modal desde `DatosPersonales`.
 *   2. Se muestra el valor actual de la condición en un input editable.
 *   3. Usuario edita y guarda → se actualiza en backend y frontend.
 *   4. Modal se cierra y se refleja el nuevo valor en la UI.
 *
 * Relación con otros modales:
 *   - `EditarAlergiasModal`: Edita lista de alergias.
 *   - `EditarVacunasModal`: Edita lista de vacunas.
 *   - `EditarTutoresModal`: Edita tutores asociados.
 *   → Todos forman parte del submódulo de **edición clínica** dentro de `DatosPersonales`.
 *
 * Uso:
 *   <EditarCondicionBaseModal
 *      isOpen={isModalAbierto}
 *      onClose={() => setIsModalAbierto(false)}
 *      estudianteId={est._id}
 *      condicionActual={condicion}
 *      token={token}
 *      onUpdated={(nuevaCondicion) => setCondicion(nuevaCondicion)}
 *   />
 */

'use client'
import { useState, useEffect } from 'react'
import { editarCondicionBase } from '@/services/condicionBase'

type EditarCondicionBaseModalProps = {
  isOpen: boolean
  onClose: () => void
  estudianteId: string
  condicionActual: string
  token: string
  onUpdated: (nuevaCondicion: string) => void
}

export default function EditarCondicionBaseModal({
  isOpen,
  onClose,
  estudianteId,
  condicionActual,
  token,
  onUpdated,
}: EditarCondicionBaseModalProps) {
  const [condicion, setCondicion] = useState(condicionActual || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    if (isOpen) {
      setCondicion(condicionActual || '')
    }
  }, [condicionActual, isOpen])




  if (!isOpen) return null

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await editarCondicionBase(estudianteId, condicion, token)
      onUpdated(data.condicion) 
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[var(--background)] p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-subtitulo text-[var(--primary)] mb-4">
          Editar Condición Base
        </h2>

        <input
          type="text"
          value={condicion}
          onChange={(e) => setCondicion(e.target.value)}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 mb-3 text-sm"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--secondary)] text-sm"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
