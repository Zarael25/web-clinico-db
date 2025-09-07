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

  // Cargar alergias actuales cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      getAlergiasByEstudiante(estudianteId, token)
        .then((data) => {
          if (data.length > 0) {
            setAlergias(data)
          } else {
            setAlergias([{ alergia: '' }]) // 👈 un input vacío si no hay alergias
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
      const data = await updateAlergias(estudianteId, alergias, token) // PUT con toda la lista
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
