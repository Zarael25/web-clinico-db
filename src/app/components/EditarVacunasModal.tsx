/**
 * Descripción:
 *   Modal para editar la lista de vacunas de un estudiante. 
 *   Permite agregar, modificar o eliminar vacunas asociadas en la colección `CondicionBase`.
 *
 * Props:
 *   - isOpen (boolean): Controla si el modal está visible.
 *   - onClose (function): Callback para cerrar el modal.
 *   - estudianteId (string): ID del estudiante al que pertenecen las vacunas.
 *   - token (string): Token JWT de autenticación.
 *   - onUpdated (function): Callback que devuelve las vacunas actualizadas al componente padre.
 *
 * Flujo:
 *   1. Al abrirse (`isOpen === true`), obtiene la lista de vacunas existentes
 *      con `getVacunasByEstudiante(estudianteId, token)`.
 *   2. Si existen vacunas → las muestra en inputs editables.
 *      Si no existen → inicializa con un input vacío.
 *   3. El usuario puede:
 *       - Modificar vacunas existentes.
 *       - Agregar más con el botón "➕ Añadir otra vacuna".
 *   4. Al guardar → se envían los cambios al backend con `updateVacunas`.
 *   5. Se ejecuta `onUpdated(data.vacunas)` para actualizar el estado en el padre.
 *   6. El modal se cierra automáticamente.
 *
 * Características:
 *   - Maneja loading y errores de forma controlada.
 *   - Permite scroll si hay muchas vacunas (`max-h-[300px] overflow-y-auto`).
 *   - Mantiene consistencia de estilos con los otros modales (condición base, alergias, tutores).
 *
 * Uso:
 *   <EditarVacunasModal
 *      isOpen={isVacunasModalOpen}
 *      onClose={() => setIsVacunasModalOpen(false)}
 *      estudianteId={est._id}
 *      token={token}
 *      onUpdated={(nuevasVacunas) => setVacunas(nuevasVacunas)}
 *   />
 */



'use client'
import { useState, useEffect } from 'react'
import { getVacunasByEstudiante, updateVacunas } from '@/services/condicionBase'

type EditarVacunasModalProps = {
  isOpen: boolean
  onClose: () => void
  estudianteId: string
  token: string
  onUpdated: (nuevasVacunas: { vacuna: string }[]) => void
}

export default function EditarVacunasModal({
  isOpen,
  onClose,
  estudianteId,
  token,
  onUpdated,
}: EditarVacunasModalProps) {
  const [vacunas, setVacunas] = useState<{ vacuna: string }[]>([{ vacuna: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    if (isOpen) {
      getVacunasByEstudiante(estudianteId, token)
        .then((data) => {
          if (data.length > 0) {
            setVacunas(data)
          } else {
            setVacunas([{ vacuna: '' }]) 
          }
        })
        .catch((err) => {
          console.error('Error cargando vacunas:', err)
          setError('No se pudieron cargar las vacunas')
        })
    }
  }, [isOpen, estudianteId, token])

  const handleInputChange = (index: number, value: string) => {
    const nuevas = [...vacunas]
    nuevas[index].vacuna = value
    setVacunas(nuevas)
  }

  const handleAddInput = () => {
    setVacunas([...vacunas, { vacuna: '' }])
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await updateVacunas(estudianteId, vacunas, token)
      onUpdated(data.vacunas)
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[var(--background)] p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-lg font-subtitulo text-[var(--primary)] mb-4">
          Editar Vacunas
        </h2>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {vacunas.map((v, idx) => (
            <input
              key={idx}
              type="text"
              value={v.vacuna}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              placeholder="Escribe una vacuna"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            />
          ))}
        </div>

        <button
          onClick={handleAddInput}
          className="mt-3 text-sm text-[var(--primary)] font-semibold hover:underline"
        >
          ➕ Añadir otra vacuna
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-4">
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
