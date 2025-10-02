/**
 * Descripción:
 *   Modal para editar la lista de alergias de un estudiante dentro del sistema clínico.
 *   Permite cargar las alergias actuales desde el backend, modificarlas, añadir nuevas
 *   y guardarlas de vuelta en la base de datos.
 *
 * Props:
 *   - isOpen (boolean): Controla si el modal está visible o no.
 *   - onClose (function): Callback para cerrar el modal sin guardar cambios.
 *   - estudianteId (string): ID único del estudiante cuyas alergias se desean editar.
 *   - token (string): Token JWT válido para autenticar las solicitudes al backend.
 *   - onUpdated (function): Callback que recibe la nueva lista de alergias actualizada
 *     después de guardarse en el backend.
 *
 * Características:
 *   - Al abrirse (`isOpen === true`), hace una petición al backend con 
 *     `getAlergiasByEstudiante(estudianteId, token)` para obtener los datos actuales.
 *   - Muestra un conjunto de inputs, uno por cada alergia. Si no hay alergias, muestra
 *     un input vacío inicial.
 *   - Permite añadir más campos dinámicamente con el botón ➕ "Añadir otra alergia".
 *   - Guarda los cambios con `updateAlergias(estudianteId, alergias, token)` y
 *     dispara `onUpdated` con el resultado.
 *   - Maneja estados de **loading** y **error** para mejorar la experiencia de usuario.
 *
 * Flujo:
 *   1. Usuario abre modal → se cargan las alergias actuales desde backend.
 *   2. Usuario edita/agrega alergias en inputs dinámicos.
 *   3. Usuario guarda → backend actualiza, frontend actualiza estado con `onUpdated`.
 *   4. Modal se cierra.
 *
 * Relación con otros componentes:
 *   - `DatosPersonales`: desde ahí se abre este modal cuando un admin/enfermería
 *     quiere editar las alergias del estudiante.
 *   - `EditarVacunasModal` y `EditarCondicionBaseModal`: comparten la misma lógica,
 *     pero para diferentes atributos de condición clínica.
 *
 * Uso:
 *   <EditarAlergiasModal
 *      isOpen={isModalAbierto}
 *      onClose={() => setIsModalAbierto(false)}
 *      estudianteId={est._id}
 *      token={token}
 *      onUpdated={(nuevasAlergias) => setAlergias(nuevasAlergias)}
 *   />
 */


'use client'
import { useState, useEffect } from 'react'
import { getAlergiasByEstudiante, updateAlergias } from '@/services/condicionBase'

type EditarAlergiasModalProps = {
  isOpen: boolean
  onClose: () => void
  estudianteId: string
  token: string
  onUpdated: (nuevasAlergias: { alergia: string }[]) => void
}

export default function EditarAlergiasModal({
  isOpen,
  onClose,
  estudianteId,
  token,
  onUpdated,
}: EditarAlergiasModalProps) {
  const [alergias, setAlergias] = useState<{ alergia: string }[]>([{ alergia: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    if (isOpen) {
      getAlergiasByEstudiante(estudianteId, token)
        .then((data) => {
          if (data.length > 0) {
            setAlergias(data)
          } else {
            setAlergias([{ alergia: '' }]) 
          }
        })
        .catch((err) => {
          console.error('Error cargando alergias:', err)
          setError('No se pudieron cargar las alergias')
        })
    }
  }, [isOpen, estudianteId, token])

  const handleInputChange = (index: number, value: string) => {
    const nuevas = [...alergias]
    nuevas[index].alergia = value
    setAlergias(nuevas)
  }

  const handleAddInput = () => {
    setAlergias([...alergias, { alergia: '' }])
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await updateAlergias(estudianteId, alergias, token) 
      onUpdated(data.alergias)
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
          Editar Alergias
        </h2>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {alergias.map((a, idx) => (
            <input
              key={idx}
              type="text"
              value={a.alergia}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              placeholder="Escribe una alergia"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            />
          ))}
        </div>

        <button
          onClick={handleAddInput}
          className="mt-3 text-sm text-[var(--primary)] font-semibold hover:underline"
        >
          ➕ Añadir otra alergia
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
