'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import NavTabs from '@/app/components/NavTabs'
import { getTutoresConEstudiantes, createTutor, updateTutor } from '@/services/tutores'


type Estudiante = {
  _id: string
  nombre: string
  appaterno: string
  apmaterno?: string
  carnet: string
  rude: string
}

type Tutor = {
  _id: string
  nombre: string
  apellido: string
  carnet: string
  lugarTrabajo?: string
  parentesco: string
  celular: string
  estudiantes: Estudiante[]
}

export default function TutoresPage() {
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal de crear
  const [showModal, setShowModal] = useState(false)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [carnet, setCarnet] = useState('')
  const [lugarTrabajo, setLugarTrabajo] = useState('')
  const [parentesco, setParentesco] = useState('')
  const [celular, setCelular] = useState('')
  const [saving, setSaving] = useState(false)

  // Modal de editar
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)

  // 🔑 token
  const token =
    typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1] || ''
      : ''

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTutoresConEstudiantes(token) // 👈 usar este
      setTutores(data.tutores)
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  // ✅ crear tutor
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await createTutor(
        {
          nombre,
          apellido,
          carnet,
          lugarTrabajo,
          parentesco,
          celular,
          estudiantes: [],
        },
        token
      )
      // limpiar
      setNombre('')
      setApellido('')
      setCarnet('')
      setLugarTrabajo('')
      setParentesco('')
      setCelular('')
      setShowModal(false)
      fetchData()
    } catch (err) {
      console.error('❌ Error al crear tutor', err)
    } finally {
      setSaving(false)
    }
  }

  // ✅ editar tutor
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTutor) return
    try {
      setSaving(true)
      await updateTutor(
        selectedTutor._id,
        {
          nombre: selectedTutor.nombre,
          apellido: selectedTutor.apellido,
          carnet: selectedTutor.carnet,
          lugarTrabajo: selectedTutor.lugarTrabajo,
          parentesco: selectedTutor.parentesco,
          celular: selectedTutor.celular,
          estudiantes: selectedTutor.estudiantes.map((e) => e._id),
        },
        token
      )
      setShowEditModal(false)
      fetchData()
    } catch (err) {
      console.error('❌ Error al actualizar tutor', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs />

      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-titulo">Tutores</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--secondary)] transition"
          >
            + Añadir
          </button>
        </div>

        {loading && <p className="text-gray-500">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && tutores.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-[var(--border)] rounded-lg shadow">
              <thead className="bg-[var(--secondary)]/30">
                <tr>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Carnet</th>
                  <th className="p-2 text-left">Parentesco</th>
                  <th className="p-2 text-left">Celular</th>
                  <th className="p-2 text-left">Lugar de Trabajo</th>
                  <th className="p-2 text-left">Estudiantes</th>
                  <th className="p-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tutores.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t border-[var(--border)] hover:bg-[var(--secondary)]/10"
                  >
                    <td className="p-2 font-semibold">
                      {t.nombre} {t.apellido}
                    </td>
                    <td className="p-2">{t.carnet}</td>
                    <td className="p-2">{t.parentesco}</td>
                    <td className="p-2">{t.celular}</td>
                    <td className="p-2">{t.lugarTrabajo || 'No registrado'}</td>
                    <td className="p-2 text-sm">
                      {t.estudiantes.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {t.estudiantes.map((e) => (
                            <li key={e._id}>
                              {e.nombre} {e.appaterno} {e.apmaterno || ''} ({e.carnet})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">Sin estudiantes</span>
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg"
                        onClick={() => {
                          setSelectedTutor(t)
                          setShowEditModal(true)
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tutores.length === 0 && (
          <p className="text-gray-500">No hay tutores registrados.</p>
        )}
      </main>

      {/* 🔹 Modal para añadir tutor */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-titulo mb-4">Añadir Tutor</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Carnet</label>
                <input
                  type="text"
                  value={carnet}
                  onChange={(e) => setCarnet(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Parentesco</label>
                <input
                  type="text"
                  value={parentesco}
                  onChange={(e) => setParentesco(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Celular</label>
                <input
                  type="text"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Lugar de trabajo</label>
                <input
                  type="text"
                  value={lugarTrabajo}
                  onChange={(e) => setLugarTrabajo(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--secondary)] disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Modal para editar tutor */}
      {showEditModal && selectedTutor && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-titulo mb-4">Editar Tutor</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  value={selectedTutor.nombre}
                  onChange={(e) =>
                    setSelectedTutor({ ...selectedTutor, nombre: e.target.value })
                  }
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Apellido</label>
                <input
                  type="text"
                  value={selectedTutor.apellido}
                  onChange={(e) =>
                    setSelectedTutor({ ...selectedTutor, apellido: e.target.value })
                  }
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Carnet</label>
                <input
                  type="text"
                  value={selectedTutor.carnet}
                  onChange={(e) =>
                    setSelectedTutor({ ...selectedTutor, carnet: e.target.value })
                  }
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Parentesco</label>
                <input
                  type="text"
                  value={selectedTutor.parentesco}
                  onChange={(e) =>
                    setSelectedTutor({ ...selectedTutor, parentesco: e.target.value })
                  }
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Celular</label>
                <input
                  type="text"
                  value={selectedTutor.celular}
                  onChange={(e) =>
                    setSelectedTutor({ ...selectedTutor, celular: e.target.value })
                  }
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Lugar de trabajo</label>
                <input
                  type="text"
                  value={selectedTutor.lugarTrabajo || ''}
                  onChange={(e) =>
                    setSelectedTutor({ ...selectedTutor, lugarTrabajo: e.target.value })
                  }
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--secondary)] disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
