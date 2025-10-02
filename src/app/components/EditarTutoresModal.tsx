/**
 * Descripción:
 *   Modal para asignar o quitar tutores asociados a un estudiante. 
 *   Muestra un listado de tutores (de la colección `Tutor`) con checkboxes para
 *   seleccionar cuáles estarán vinculados al estudiante.
 *
 * Props:
 *   - isOpen (boolean): Controla si el modal está visible.
 *   - onClose (function): Callback para cerrar el modal.
 *   - estudianteId (string): ID del estudiante al que se asignan tutores.
 *   - token (string): Token JWT para autenticar las peticiones al backend.
 *   - onUpdated (function): Callback que se ejecuta al guardar cambios (para refrescar datos en el padre).
 *
 * Características:
 *   - Al abrirse (`isOpen === true`), obtiene todos los tutores con sus estudiantes mediante
 *     `getTutoresConEstudiantes(token)`.
 *   - Marca como seleccionados aquellos tutores que ya tienen asignado al estudiante.
 *   - Permite alternar selección/deselección con checkboxes (`handleToggle`).
 *   - Al guardar:
 *       → Itera sobre cada tutor.
 *       → Si está seleccionado, añade el `estudianteId` a su lista de estudiantes.
 *       → Si no, lo elimina de su lista.
 *       → Llama al servicio `updateTutor` para actualizar en el backend.
 *   - Cierra el modal y ejecuta `onUpdated` para notificar al padre.
 *
 * Flujo:
 *   1. Usuario abre modal desde `DatosPersonales`.
 *   2. Se listan todos los tutores, con los ya asignados marcados.
 *   3. Usuario marca o desmarca tutores.
 *   4. Al guardar → se actualiza en backend y UI.
 *   5. Modal se cierra automáticamente.
 *
 * Relación con otros modales:
 *   - `EditarCondicionBaseModal`: Edita condición base.
 *   - `EditarAlergiasModal`: Edita lista de alergias.
 *   - `EditarVacunasModal`: Edita lista de vacunas.
 *   → Este es el único modal de edición que maneja **relaciones entre entidades** (Estudiante ↔ Tutor).
 *
 * Uso:
 *   <EditarTutoresModal
 *      isOpen={isTutoresModalOpen}
 *      onClose={() => setIsTutoresModalOpen(false)}
 *      estudianteId={est._id}
 *      token={token}
 *      onUpdated={fetchTutoresExtra}
 *   />
 */

'use client'
import { useEffect, useState } from 'react'
import { getTutoresConEstudiantes, updateTutor } from '@/services/tutores'

type Props = {
  isOpen: boolean
  onClose: () => void
  estudianteId: string
  token: string
  onUpdated: () => void
}

export default function EditarTutoresModal({ isOpen, onClose, estudianteId, token, onUpdated }: Props) {
  const [tutores, setTutores] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  
  useEffect(() => {
    if (isOpen) {
      getTutoresConEstudiantes(token).then((data) => {
        setTutores(data.tutores)

        
        const asignados = data.tutores
          .filter((t: any) => t.estudiantes.some((e: any) => e._id === estudianteId))
          .map((t: any) => t._id)

        setSelected(asignados)
      })
    }
  }, [isOpen, token, estudianteId])

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      for (const tutor of tutores) {
        let nuevosEstudiantesIds = tutor.estudiantes.map((e: any) => e._id)

        if (selected.includes(tutor._id)) {
          
          if (!nuevosEstudiantesIds.includes(estudianteId)) {
            nuevosEstudiantesIds.push(estudianteId)
          }
        } else {
          
          nuevosEstudiantesIds = nuevosEstudiantesIds.filter((id: string) => id !== estudianteId)
        }

        await updateTutor(tutor._id, { estudiantes: nuevosEstudiantesIds }, token)
      }

      onUpdated()
      onClose()
    } catch (err) {
      console.error('❌ Error al asignar tutores', err)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-titulo mb-4">Asignar Tutores</h2>

        <div className="max-h-64 overflow-y-auto border p-2 rounded">
          {tutores.map((t) => (
            <label key={t._id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selected.includes(t._id)}
                onChange={() => handleToggle(t._id)}
              />
              <span>{t.nombre} {t.apellido} ({t.carnet})</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--secondary)] disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
