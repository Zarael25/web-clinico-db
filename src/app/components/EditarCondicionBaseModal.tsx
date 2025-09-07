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
      onUpdated(data.condicion) // devolver la nueva condición al padre
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
