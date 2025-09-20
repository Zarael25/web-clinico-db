'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/app/components/Header'
import NavTabs from '@/app/components/NavTabs'
import DatosPersonales from '@/app/components/DatosPersonales'
import NuevaAtencion from '@/app/components/NuevaAtencion'
import AgregarAtencion from '@/app/components/AgregarAtencion'
import { getEstudianteById } from '@/services/estudiantes'
import { getCondicionBaseByEstudiante } from '@/services/condicionBase'
import HistorialAtenciones from '@/app/components/HistorialAtenciones'

export default function ClinicoHistorialPage() {
  const params = useParams()
  const estudianteId = params?.id as string
  const [estudiante, setEstudiante] = useState<any>(null)
  const [seccionActiva, setSeccionActiva] = useState<'datos' | 'nueva' | 'historial' | 'agregar'>('datos')
  const [condicionBase, setCondicionBase] = useState<any>(null)


  const token =
    typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1] || '' 
      : ''

  useEffect(() => {
    if (estudianteId && token) {
      getEstudianteById(estudianteId, token)
        .then((data) => setEstudiante(data))
        .catch((err) => console.error('Error cargando estudiante:', err))


      getCondicionBaseByEstudiante(estudianteId, token)
        .then((data) => setCondicionBase(data))
        .catch((err) => console.error('Error cargando condición base:', err))

    }
  }, [estudianteId, token])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs />
      <main className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Aside izquierdo */}
        <aside className="md:col-span-1 bg-[var(--background)] border border-[var(--border)] p-4 rounded-xl">
          {estudiante ? (
            <>
              <h2 className="text-xl font-bold text-[var(--primary)]">
                {estudiante?.nombre} {estudiante?.appaterno} {estudiante?.apmaterno}
              </h2>
              <p className="text-sm mt-2">Curso: {estudiante.gestiones?.[0]?.curso || '—'}</p>
              <p className="text-sm">Nivel: {estudiante.gestiones?.[0]?.nivel || '—'}</p>
              <p className="text-sm">RUDE: {estudiante.rude}</p>

              <div className="mt-6 space-y-2">
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    seccionActiva === 'datos'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
                  }`}
                  onClick={() => setSeccionActiva('datos')}
                >
                  Datos
                </button>

                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    seccionActiva === 'nueva'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
                  }`}
                  onClick={() => setSeccionActiva('nueva')}
                >
                  Nueva Atención
                </button>

                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
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
          {seccionActiva === 'datos' && estudiante && (
            <DatosPersonales estudiante={estudiante} condicionBase={condicionBase} token={token} />
          )}



          {seccionActiva === 'nueva' && condicionBase && (
            <NuevaAtencion
              alergias={condicionBase?.alergias || []} 
              condicion={condicionBase?.condicion || ''} 
              vacunas={condicionBase?.vacunas || []} 
              onAgregarClick={() => setSeccionActiva('agregar')}
            />
          )}




          {seccionActiva === 'historial' && (
            <HistorialAtenciones estudianteId={estudianteId} token={token} />
          )}



          {seccionActiva === 'agregar' && condicionBase && (
            <AgregarAtencion
              condicion={condicionBase?.condicion}
              alergias={condicionBase?.alergias || []}
              vacunas={condicionBase?.vacunas || []}
              estudianteId={estudianteId}
              token={token}
            />
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
          </ul>
        </aside>
      </main>
    </div>
  )
}
