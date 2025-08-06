'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import NavTabs from '../../components/NavTabs'

export default function EstudiantesPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estudiantes, setEstudiantes] = useState<any[]>([])
  const [paginaActual, setPaginaActual] = useState(1)
  const estudiantesPorPagina = 12

  // Cargar estudiantes desde el JSON en /public
  useEffect(() => {
    fetch('/data/estudiantes.json')
      .then((res) => res.json())
      .then((data) => setEstudiantes(data))
  }, [])

  // Filtrar estudiantes según la búsqueda
  const estudiantesFiltrados = estudiantes.filter(est =>
    est.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Calcular estudiantes para la página actual
  const indiceInicial = (paginaActual - 1) * estudiantesPorPagina
  const indiceFinal = indiceInicial + estudiantesPorPagina
  const estudiantesPagina = estudiantesFiltrados.slice(indiceInicial, indiceFinal)

  // Calcular total de páginas
  const totalPaginas = Math.ceil(estudiantesFiltrados.length / estudiantesPorPagina)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <NavTabs />
      <main className="p-6">
        {/* Barra de búsqueda */}
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setPaginaActual(1) // Reiniciar a la primera página al buscar
            }}
            className="flex-1 p-3 border border-border rounded-lg bg-background 
                       focus:outline-none focus:ring-2 focus:ring-primary font-parrafo"
          />
        </div>

        {/* Fichas de estudiantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {estudiantesPagina.map(est => (
            <div
              key={est.id}
              className="bg-background border border-border rounded-xl shadow-md p-5"
            >
              <h3 className="text-xl font-titulo text-primary mb-2">
                {est.nombre}
              </h3>
              <p className="font-parrafo text-foreground">
                <strong>Curso:</strong> {est.curso}
              </p>
              <p className="font-parrafo text-foreground mb-4">
                <strong>Turno:</strong> {est.turno}
              </p>
              <button className="w-full bg-primary text-white py-2 rounded-lg font-subtitulo
                                 hover:bg-secondary transition-colors">
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
                className={`px-4 py-2 rounded-lg border 
                           ${paginaActual === i + 1
                             ? 'bg-primary text-white'
                             : 'bg-background text-foreground hover:bg-secondary/20'}
                           transition`}
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
