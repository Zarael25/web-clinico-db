'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import NavTabs from '../../components/NavTabs'
import { getAtencionesByFecha } from '@/services/atenciones'
import DetalleAtencion from '@/app/components/DetalleAtencion'

type Atencion = {
  _id: string
  fecha: string
  motivo_consulta: string
  diagnostico: string
  tratamiento: string
  sugerir_baja: boolean
  estudiante: {
    _id: string
    nombre: string
    appaterno: string
    apmaterno?: string
    carnet: string
    rude: string
    gestiones: {
      gestion: number
      curso: string
      cursoGob: string
      nivel: string
      reprobado: boolean
    }[]
  } | null
  user: {
    _id: string
    nombre: string
  }
}

function getHoyISO() {
  const hoy = new Date()
  const yyyy = hoy.getFullYear()
  const mm = String(hoy.getMonth() + 1).padStart(2, '0')
  const dd = String(hoy.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function ClinicoCalendarioPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(getHoyISO())
  const [mes, setMes] = useState(new Date().getMonth())
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [atenciones, setAtenciones] = useState<Atencion[]>([])
  const [loading, setLoading] = useState(false)

  // 👇 nuevo estado para detalle
  const [atencionSeleccionada, setAtencionSeleccionada] = useState<string | null>(null)

  const token =
    typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1] || ''
      : ''

  useEffect(() => {
    const fetchAtenciones = async () => {
      setLoading(true)
      try {
        const data = await getAtencionesByFecha(fechaSeleccionada, token)
        setAtenciones(data)
      } catch (err) {
        console.error(err)
        setAtenciones([])
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchAtenciones()
    }
  }, [fechaSeleccionada, token])

  const atencionesHoy = [...atenciones].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  )

  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const primerDiaSemana = new Date(anio, mes, 1).getDay()
  const dias: (number | null)[] = []

  for (let i = 0; i < (primerDiaSemana === 0 ? 6 : primerDiaSemana - 1); i++) {
    dias.push(null)
  }
  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i)
  }

  const seleccionarDia = (dia: number) => {
    const mesString = String(mes + 1).padStart(2, '0')
    const diaString = String(dia).padStart(2, '0')
    setFechaSeleccionada(`${anio}-${mesString}-${diaString}`)
  }

  const meses = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs />
      <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ===== LISTA ATENCIONES ===== */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-titulo">Atenciones</h2>
            <span className="font-subtitulo">{fechaSeleccionada}</span>
          </div>
          {loading ? (
            <p className="font-parrafo text-gray-500">Cargando...</p>
          ) : atencionesHoy.length > 0 ? (
            <div className="grid gap-3">
              {atencionesHoy.map((a) => (
                <div
                  key={a._id}
                  className="p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
                  onClick={() => setAtencionSeleccionada(a._id)}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {a.estudiante
                        ? `${a.estudiante.nombre} ${a.estudiante.appaterno}`
                        : 'Estudiante desconocido'}
                    </span>
                    <span className="text-sm">
                      {new Date(a.fecha).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Motivo: {a.motivo_consulta}</p>
                  <p className="text-xs text-gray-400">Atendido por: {a.user?.nombre}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-parrafo text-gray-500">No hay atenciones para esta fecha.</p>
          )}
        </div>

        {/* ===== CALENDARIO ===== */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow p-4">
          <div className="flex justify-center gap-4 mb-4">
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="w-auto border rounded-lg px-3 py-2 
                         bg-[var(--background)] text-[var(--foreground)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {meses.map((m, i) => (
                <option key={i} value={i} className="bg-[var(--background)] text-[var(--foreground)]">
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="w-24 border rounded-lg px-3 py-2 
                         bg-[var(--background)] text-[var(--foreground)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {['L','M','X','J','V','S','D'].map((d) => (
              <div key={d} className="font-subtitulo text-gray-500">{d}</div>
            ))}
            {dias.map((dia, i) =>
              dia ? (
                <button
                  key={i}
                  onClick={() => seleccionarDia(dia)}
                  className={`p-2 rounded transition ${
                    fechaSeleccionada ===
                    `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                      ? 'bg-[var(--primary)] text-white'
                      : 'hover:bg-[var(--secondary)]/30'
                  }`}
                >
                  {dia}
                </button>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>
      </main>

      {/* ===== MODAL DETALLE ===== */}
      {atencionSeleccionada && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-lg max-w-lg w-full shadow-lg overflow-y-auto max-h-[90vh]">
            <DetalleAtencion
              atencionId={atencionSeleccionada}
              token={token}
              onVolver={() => setAtencionSeleccionada(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
