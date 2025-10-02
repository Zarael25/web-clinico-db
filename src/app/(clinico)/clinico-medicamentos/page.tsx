/**
 * Descripción:
 *   Página de gestión de medicamentos en el sistema "Don Bosco Clínico".
 *   Permite listar los medicamentos registrados y crear nuevos desde un modal.
 *
 * Características:
 *   - Obtiene la lista de medicamentos desde el backend mediante token JWT.
 *   - Presenta los datos en una tabla responsiva:
 *       • Nombre Comercial
 *       • Nombre Genérico
 *       • Presentación
 *       • Fecha de creación
 *   - Incluye un modal con formulario para añadir nuevos medicamentos:
 *       • Validación de campos obligatorios.
 *       • Feedback visual de guardado/cancelación.
 *   - Maneja estados locales:
 *       • loading → muestra mensaje de carga.
 *       • error → muestra error si falla la petición.
 *       • saving → evita duplicar peticiones mientras guarda.
 *
 * Roles y permisos:
 *   - Acceso restringido en backend a roles: ['admin', 'enfermeria'].
 *   - Cualquier usuario autorizado puede visualizar los medicamentos listados.
 *
 * Uso:
 *   - El botón "+ Añadir" abre el modal.
 *   - Al confirmar el formulario se crea el medicamento y se refresca la lista.
 *   - El modal puede cerrarse manualmente o tras guardar con éxito.
 *
 * Componentes relacionados:
 *   - Header: Encabezado principal de la aplicación.
 *   - NavTabs: Navegación superior entre secciones.
 *   - Servicios:
 *       • getMedicamentos(token) → listado desde API.
 *       • createMedicamento(token, data) → creación en API.
 */

'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import NavTabs from '@/app/components/NavTabs'
import { getMedicamentos, createMedicamento } from '@/services/medicamentos'

type Medicamento = {
  _id: string
  nombre_comercial: string
  nombre_generico: string
  presentacion: string
  createdAt: string
}

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  const [showModal, setShowModal] = useState(false)
  const [nombreComercial, setNombreComercial] = useState('')
  const [nombreGenerico, setNombreGenerico] = useState('')
  const [presentacion, setPresentacion] = useState('')
  const [saving, setSaving] = useState(false)

  
  const token =
    typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1] || ''
      : ''

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMedicamentos(token)
      setMedicamentos(data)
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await createMedicamento(token, {
        nombre_comercial: nombreComercial,
        nombre_generico: nombreGenerico,
        presentacion,
      })
      // limpiar
      setNombreComercial('')
      setNombreGenerico('')
      setPresentacion('')
      setShowModal(false)
      fetchData()
    } catch (err) {
      console.error('❌ Error al crear medicamento', err)
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
          <h1 className="text-2xl font-titulo">Medicamentos</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--secondary)] transition"
          >
            + Añadir
          </button>
        </div>

        {loading && <p className="text-gray-500">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && medicamentos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-[var(--border)] rounded-lg shadow">
              <thead className="bg-[var(--secondary)]/30">
                <tr>
                  <th className="p-2 text-left">Nombre Comercial</th>
                  <th className="p-2 text-left">Nombre Genérico</th>
                  <th className="p-2 text-left">Presentación</th>
                  <th className="p-2 text-left">Fecha Creación</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map((m) => (
                  <tr
                    key={m._id}
                    className="border-t border-[var(--border)] hover:bg-[var(--secondary)]/10"
                  >
                    <td className="p-2 font-semibold">{m.nombre_comercial}</td>
                    <td className="p-2">{m.nombre_generico}</td>
                    <td className="p-2">{m.presentacion}</td>
                    <td className="p-2 text-sm text-gray-500">
                      {new Date(m.createdAt).toLocaleDateString('es-BO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && medicamentos.length === 0 && (
          <p className="text-gray-500">No hay medicamentos registrados.</p>
        )}
      </main>

      {/* Modal para añadir */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-titulo mb-4">Añadir Medicamento</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-subtitulo mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={nombreComercial}
                  onChange={(e) => setNombreComercial(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-subtitulo mb-1">Nombre Genérico</label>
                <input
                  type="text"
                  value={nombreGenerico}
                  onChange={(e) => setNombreGenerico(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-subtitulo mb-1">Presentación</label>
                <input
                  type="text"
                  value={presentacion}
                  onChange={(e) => setPresentacion(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                  required
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
    </div>
  )
}
