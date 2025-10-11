/**
 * Descripción:
 *   Página de listado y búsqueda de estudiantes en el sistema "Don Bosco Clínico".
 *   Permite buscar estudiantes en tiempo real, mostrar sus datos básicos y navegar
 *   al historial clínico de cada uno.
 *
 * Características:
 *   - Barra de búsqueda:
 *       • Búsqueda por nombre, apellido, carnet, RUDE, curso o nivel.
 *       • Debounce de 500ms para optimizar llamadas al backend.
 *   - Listado de estudiantes:
 *       • Se muestran en tarjetas (fichas) con:
 *           ◦ Nombre completo
 *           ◦ Curso y nivel actual
 *       • Botón "Revisar" que redirige al historial clínico del estudiante (`/clinico-historial/:id`).
 *   - Paginación:
 *       • Muestra 12 estudiantes por página.
 *       • Navegación entre páginas con botones dinámicos.
 *   - Manejo de estados locales:
 *       • busqueda → término actual en la barra de búsqueda.
 *       • estudiantes → lista completa obtenida del backend.
 *       • paginaActual → página visible en la paginación.
 *       • estudiantesPorPagina → constante (12 por página).
 *
 * Roles y permisos:
 *   - Requiere token JWT válido para consultar estudiantes.
 *   - El backend filtra resultados según los niveles asignados al usuario autenticado.
 *
 * Uso:
 *   - Al cargar la página se listan todos los estudiantes visibles para el usuario.
 *   - Al escribir en la barra de búsqueda, se filtran los resultados.
 *   - El usuario puede cambiar de página con la paginación inferior.
 *   - Al hacer clic en "Revisar", se navega al detalle clínico del estudiante.
 *
 * Componentes relacionados:
 *   - Header: Encabezado global de la aplicación.
 *   - NavTabs: Navegación superior entre secciones.
 *   - Servicios:
 *       • buscarEstudiantes(query, token) → obtiene estudiantes filtrados.
 */
'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import NavTabs from '../../components/NavTabs'
import { useRouter } from 'next/navigation'
import { buscarEstudiantesPaginado } from '@/services/estudiantes'

export default function EstudiantesPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estudiantes, setEstudiantes] = useState<any[]>([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalEstudiantes, setTotalEstudiantes] = useState(0)
  const estudiantesPorPagina = 12
  const router = useRouter()

  const token =
    typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1]
      : ''

  useEffect(() => {
    if (!token) return

    const delayDebounce = setTimeout(async () => {
      try {
        const query = busqueda.trim().replace(/\s+/g, '_')
        const data = await buscarEstudiantesPaginado(
          query,
          paginaActual,
          estudiantesPorPagina,
          token
        )

        setEstudiantes(data.data)
        setTotalEstudiantes(data.total)
        setTotalPaginas(Math.ceil(data.total / estudiantesPorPagina))
      } catch (error) {
        console.error('Error al cargar estudiantes:', error)
      }
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [busqueda, paginaActual, token])

  const handleChangePage = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // 🧩 Generar la lista resumida de páginas para mostrar
  const getPaginasVisibles = () => {
    const paginas: (number | string)[] = []

    if (totalPaginas <= 6) {
      // Si hay pocas páginas, las mostramos todas
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i)
    } else {
      // Siempre mostrar la primera página
      paginas.push(1)

      // Mostrar "..." si el rango activo está lejos del inicio
      if (paginaActual > 4) paginas.push('...')

      // Páginas cercanas a la actual (una antes, la actual, una después)
      const start = Math.max(2, paginaActual - 1)
      const end = Math.min(totalPaginas - 1, paginaActual + 1)
      for (let i = start; i <= end; i++) paginas.push(i)

      // Mostrar "..." si el rango activo está lejos del final
      if (paginaActual < totalPaginas - 3) paginas.push('...')

      // Siempre mostrar la última página
      paginas.push(totalPaginas)
    }

    return paginas
  }

  const paginasVisibles = getPaginasVisibles()

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs />
      <main className="p-6">
        {/* 🔍 Barra de búsqueda */}
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar estudiante (ej: Valeria Suárez PM 2B)..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setPaginaActual(1)
            }}
            className="flex-1 p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] 
                       focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-parrafo"
          />
        </div>

        {/* 🧾 Información general 
        <p className="text-sm text-[var(--muted)] mb-4 font-parrafo">
          Mostrando página {paginaActual} de {totalPaginas} — {totalEstudiantes} estudiantes encontrados
        </p>*/}

        {/* 🧍‍♀️ Fichas de estudiantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {estudiantes.map((est) => (
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

        {/* 🔢 Paginación resumida */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap items-center">
            {/* Flecha anterior */}
            <button
              onClick={() => handleChangePage(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-4 py-2 rounded-lg border hover:bg-[var(--secondary)]/20 disabled:opacity-50"
            >
              ⬅
            </button>

            {/* Números de página resumidos */}
            {paginasVisibles.map((num, idx) =>
              num === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-3 font-bold text-[var(--muted)]">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => handleChangePage(num as number)}
                  className={`px-4 py-2 rounded-lg border transition
                    ${
                      paginaActual === num
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]/20'
                    }`}
                >
                  {num}
                </button>
              )
            )}

            {/* Flecha siguiente */}
            <button
              onClick={() => handleChangePage(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 rounded-lg border hover:bg-[var(--secondary)]/20 disabled:opacity-50"
            >
              ➡
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
