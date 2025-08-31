'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import NavTabs from '../../components/NavTabs'
import { useRouter } from 'next/navigation'
import { buscarEstudiantes } from '@/services/estudiantes'

export default function EstudiantesPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estudiantes, setEstudiantes] = useState<any[]>([])
  const [paginaActual, setPaginaActual] = useState(1)
  const estudiantesPorPagina = 12
  const router = useRouter()

  // Leer token desde cookie
  const token =
    typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1]
      : ''

  // 🔹 Efecto inicial: traer todos los estudiantes
  useEffect(() => {
    if (token) {
      buscarEstudiantes('', token).then((data) => setEstudiantes(data.data))
    }
  }, [token])

  // 🔹 Efecto reactivo: buscar automáticamente mientras escribe
  useEffect(() => {
    if (!token) return

    const delayDebounce = setTimeout(async () => {
      const query = busqueda.trim().replace(/\s+/g, '_') // espacios → guiones bajos
      const data = await buscarEstudiantes(query, token)
      setEstudiantes(data.data)
      setPaginaActual(1)
    }, 500) // ⏳ 500ms de espera

    return () => clearTimeout(delayDebounce) // limpiar timeout si sigue escribiendo
  }, [busqueda, token])

  // Calcular estudiantes para la página actual
  const indiceInicial = (paginaActual - 1) * estudiantesPorPagina
  const indiceFinal = indiceInicial + estudiantesPorPagina
  const estudiantesPagina = estudiantes.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(estudiantes.length / estudiantesPorPagina)

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs />
      <main className="p-6">
        {/* Barra de búsqueda */}
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar estudiante (ej: Valeria Suárez PM 2B)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] 
                       focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-parrafo"
          />
        </div>

        {/* Fichas de estudiantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {estudiantesPagina.map((est) => (
            <div
              key={est._id}
              className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-md p-5"
            >
              <h3 className="text-xl font-titulo text-[var(--primary)] mb-2">
                {est.nombre} {est.appaterno} {est.apmaterno}
              </h3>
              <p className="font-parrafo text-[var(--foreground)]">
                <strong>Curso:</strong> {est.gestiones?.[0]?.curso || '—'}
              </p>
              <p className="font-parrafo text-[var(--foreground)] mb-4">
                <strong>Nivel:</strong> {est.gestiones?.[0]?.nivel || '—'}
              </p>
              <button
                onClick={() => router.push(`/clinico-historial/${est._id}`)}
                className="w-full bg-[var(--primary)] text-white py-2 rounded-lg font-subtitulo
                          hover:bg-[var(--secondary)] transition-colors"
              >
                Revisar
              </button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPaginaActual(i + 1)}
                className={`px-4 py-2 rounded-lg border transition
                           ${
                             paginaActual === i + 1
                               ? 'bg-[var(--primary)] text-white'
                               : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]/20'
                           }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
