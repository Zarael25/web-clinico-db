'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import NavTabs from '../../components/NavTabs'
import { getAtencionesByFecha, descargarReporteAtenciones } from '@/services/atenciones'
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
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/La_Paz',
  })
}


function toBoliviaDateString(fechaISO: string) {
  return new Date(fechaISO).toLocaleDateString('en-CA', {
    timeZone: 'America/La_Paz',
  }) // 👉 "YYYY-MM-DD"
}



export default function ClinicoCalendarioPage() {
  // 📅 Estados para el calendario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(getHoyISO())
  const [mesCal, setMesCal] = useState(new Date().getMonth())
  const [anioCal, setAnioCal] = useState(new Date().getFullYear())

  const [atenciones, setAtenciones] = useState<Atencion[]>([])
  const [loading, setLoading] = useState(false)
  const [atencionSeleccionada, setAtencionSeleccionada] = useState<string | null>(null)

  const [usuario, setUsuario] = useState<any>(null)
  const [modoReporte, setModoReporte] = useState<'anio' | 'mes' | 'dia'>('anio')


  const rolesReporte = ['admin', 'enfermeria', 'administracion']
  const puedeDescargarReporte = usuario?.roles?.some((r: string) =>
    rolesReporte.includes(r)
  )



  const token =
    typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1] || ''
      : ''

  // 🔑 Recuperar usuario de localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario')
    if (storedUser) {
      setUsuario(JSON.parse(storedUser))
    }
  }, [])


  // Cargar atenciones por fecha seleccionada (solo calendario)
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

  const atencionesHoy = atenciones
    .filter((a) => toBoliviaDateString(a.fecha) === fechaSeleccionada)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  // ✅ Solo estos roles pueden ver detalle
  const rolesPermitidos = ['admin', 'enfermeria']
  const puedeVerDetalles = usuario?.roles?.some((r: string) => rolesPermitidos.includes(r)) // ⬅️ verificación

  const handleClickAtencion = (id: string) => {
    if (puedeVerDetalles) {
      setAtencionSeleccionada(id)
    }
  }
  
  // 📆 lógica calendario
  const diasEnMes = new Date(anioCal, mesCal + 1, 0).getDate()
  const primerDiaSemana = new Date(anioCal, mesCal, 1).getDay()
  const dias: (number | null)[] = []

  for (let i = 0; i < (primerDiaSemana === 0 ? 6 : primerDiaSemana - 1); i++) {
    dias.push(null)
  }
  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i)
  }

  const seleccionarDia = (dia: number) => {
    const mesString = String(mesCal + 1).padStart(2, '0')
    const diaString = String(dia).padStart(2, '0')
    setFechaSeleccionada(`${anioCal}-${mesString}-${diaString}`)
  }

  // 📑 función descargar reporte (basada en calendario y modoReporte)
  const handleDescargarReporte = async () => {
    try {
      let anio = String(anioCal)
      let mes: string | undefined
      let dia: string | undefined

      if (modoReporte === 'mes' || modoReporte === 'dia') {
        mes = String(mesCal + 1) // 👈 mesCal es 0-based, sumamos 1
      }
      if (modoReporte === 'dia') {
        dia = fechaSeleccionada.split('-')[2] // 👈 extraemos el día del string YYYY-MM-DD
      }

      const blob = await descargarReporteAtenciones(token, anio, mes, dia)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'reporte-atenciones.pdf'
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('❌ Error al descargar el reporte:', err)
    }
  }

  const meses = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs>
        {puedeDescargarReporte && (
          <>
            {/* 👉 Select Año/Mes/Día */}
            <select
              value={modoReporte}
              onChange={(e) => setModoReporte(e.target.value as 'anio' | 'mes' | 'dia')}
              className="border rounded px-3 py-1.5 bg-[var(--background)] text-[var(--foreground)] text-sm"
            >
              <option value="anio">Año</option>
              <option value="mes">Mes</option>
              <option value="dia">Día</option>
            </select>

            {/* 👉 Texto dinámico */}
            <span className="text-xs text-gray-500 hidden sm:inline">
              {modoReporte === 'anio' && `Año: ${anioCal}`}
              {modoReporte === 'mes' && `Mes: ${mesCal + 1} / ${anioCal}`}
              {modoReporte === 'dia' && `Día: ${fechaSeleccionada}`}
            </span>

            {/* 👉 Botón de descarga */}
            <button
              onClick={handleDescargarReporte}
              className="bg-[var(--primary)] text-white px-3 py-1.5 rounded text-sm hover:bg-[var(--secondary)] transition"
            >
              Descargar
            </button>
          </>
        )}
      </NavTabs>










      <main className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* ===== LISTA ATENCIONES ===== */}
        <div className="lg:col-span-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow p-4">
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
                  className={`p-4 border rounded-lg shadow-sm transition ${
                    puedeVerDetalles ? 'cursor-pointer hover:shadow-md' : ''
                  }`}
                  onClick={puedeVerDetalles ? () => handleClickAtencion(a._id) : undefined} // ⬅️ cambio
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {a.estudiante
                        ? `${a.estudiante.nombre} ${a.estudiante.appaterno}`
                        : 'Estudiante desconocido'}
                    </span>


                    <span className="text-xs text-gray-500">
                      {toBoliviaDateString(a.fecha)} {new Date(a.fecha).toLocaleTimeString('es-BO', {
                        timeZone: 'America/La_Paz',
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
        <div className="lg:col-span-2 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow p-4">
          <div className="flex justify-center gap-4 mb-4">
            <select
              value={mesCal}
              onChange={(e) => setMesCal(Number(e.target.value))}
              className="w-auto border rounded-lg px-3 py-2 
                         bg-[var(--background)] text-[var(--foreground)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {meses.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              value={anioCal}
              onChange={(e) => setAnioCal(Number(e.target.value))}
              className="w-24 border rounded-lg px-3 py-2"
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
                    `${anioCal}-${String(mesCal + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
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
      {atencionSeleccionada && puedeVerDetalles && ( // ⬅️ solo renderizar modal si tiene permiso
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
