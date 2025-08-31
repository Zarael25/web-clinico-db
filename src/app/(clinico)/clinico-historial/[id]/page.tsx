'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/app/components/Header'
import NavTabs from '@/app/components/NavTabs'
import DatosPersonales from '@/app/components/DatosPersonales'
import NuevaAtencion from '@/app/components/NuevaAtencion'
import AgregarAtencion from '@/app/components/AgregarAtencion'  // 1. Importar

export default function ClinicoHistorialPage() {
  const params = useParams()
  const estudianteId = params?.id
  const [estudiante, setEstudiante] = useState<any>(null)

  // 2. Agrego la nueva sección 'agregar'
  const [seccionActiva, setSeccionActiva] = useState<'datos' | 'nueva' | 'historial' | 'agregar'>('datos')

  useEffect(() => {
    fetch('/data/estudiantes.json')
      .then(res => res.json())
      .then(data => {
        const encontrado = data.find((e: any) => e.id === Number(estudianteId))
        setEstudiante(encontrado)
      })
  }, [estudianteId])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs />
      <main className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Aside izquierdo */}
        <aside className="md:col-span-1 bg-[var(--background)] border border-[var(--border)] p-4 rounded-xl">
          {estudiante ? (
            <>
              <h2 className="text-xl font-bold text-[var(--primary)]">{estudiante.nombre}</h2>
              <p className="text-sm mt-2">Curso: {estudiante.curso}</p>
              <p className="text-sm">Turno: {estudiante.turno}</p>
              <p className="text-sm">Hora: {estudiante.hora || 'No disponible'}</p>

              <div className="mt-6 space-y-2">
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors
                    ${
                      seccionActiva === 'datos'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
                    }`}
                  onClick={() => setSeccionActiva('datos')}
                >
                  Datos
                </button>

                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors
                    ${
                      seccionActiva === 'nueva'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
                    }`}
                  onClick={() => setSeccionActiva('nueva')}
                >
                  Nueva Atención
                </button>

                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors
                    ${
                      seccionActiva === 'historial'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
                    }`}
                  onClick={() => setSeccionActiva('historial')}
                >
                  Historial
                </button>
              </div>
            </>
          ) : (
            <p>Cargando estudiante...</p>
          )}
        </aside>

        {/* Contenido central dinámico */}
        <section className="md:col-span-3 border border-[var(--border)] rounded-xl p-4 min-h-[300px]">
          {seccionActiva === 'datos' && <DatosPersonales />}

          {seccionActiva === 'nueva' && (
            <NuevaAtencion
              alergias={estudiante?.alergias || []}
              condicion={estudiante?.condicionBase || ''}
              vacunas={estudiante?.vacunas || []}
              onAgregarClick={() => setSeccionActiva('agregar')}  // 3. Paso la función para cambiar sección
            />
          )}

          {seccionActiva === 'historial' && (
            <p className="text-center text-[var(--foreground)]/70">
              Historial médico del estudiante (pendiente)
            </p>
          )}

          {seccionActiva === 'agregar' && <AgregarAtencion />}

          {!seccionActiva && (
            <p className="text-center text-[var(--foreground)]/70">
              Seleccione una opción
            </p>
          )}
        </section>

        {/* Atenciones anteriores */}
        <aside className="md:col-span-1 border border-[var(--border)] rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Atenciones anteriores</h3>
          <ul className="space-y-2 text-sm">
            <li>📅 2025-08-01 — 08:00</li>
            <li>📅 2025-07-23 — 09:15</li>
            <li>📅 2025-07-10 — 07:45</li>
            <li>📅 2025-06-28 — 10:30</li>
            {/* Más adelante estos datos se cargarán desde JSON o BD */}
          </ul>
        </aside>
      </main>
    </div>
  )
}
