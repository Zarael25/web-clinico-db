'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import NavTabs from '../../components/NavTabs'

type Atencion = {
  nombre: string
  paralelo: string
  turno: string
  hora: string
}

// Datos de prueba
const atencionesData: Record<string, Atencion[]> = {
  '2025-04-25': [
{ nombre: 'Alvaro Perez', paralelo: '4A', turno: 'PM', hora: '08:30' },
    { nombre: 'Maria Lopez', paralelo: '3B', turno: 'SM', hora: '09:15' },
    { nombre: 'Carlos Sanchez', paralelo: '5C', turno: 'PT', hora: '07:45' },
    { nombre: 'Laura Fernandez', paralelo: '2A', turno: 'SM', hora: '10:00' },
    { nombre: 'Pedro Vargas', paralelo: '1C', turno: 'PM', hora: '08:45' },
    { nombre: 'Sofia Romero', paralelo: '6B', turno: 'SM', hora: '09:30' },
    { nombre: 'Luis Gutierrez', paralelo: '2B', turno: 'PT', hora: '11:15' },
    { nombre: 'Camila Morales', paralelo: '3A', turno: 'SM', hora: '07:30' },
    { nombre: 'Jorge Castillo', paralelo: '5A', turno: 'PM', hora: '10:45' },
    { nombre: 'Valentina Rios', paralelo: '4B', turno: 'SM', hora: '09:50' }
  ],
  '2025-04-26': [
    { nombre: 'Laura Fernandez', paralelo: '2A', turno: 'SM', hora: '10:00' }
  ]
}

export default function ClinicoCalendarioPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2025-04-25')
  const [mes, setMes] = useState(3) // Abril (0=Enero)
  const [anio, setAnio] = useState(2025)

  // Atenciones ordenadas por hora
  const atencionesHoy =
    (atencionesData[fechaSeleccionada] || []).sort((a, b) =>
      a.hora.localeCompare(b.hora)
    )

  // Generar días del calendario
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const primerDiaSemana = new Date(anio, mes, 1).getDay()
  const dias: (number | null)[] = []

  for (let i = 0; i < (primerDiaSemana === 0 ? 6 : primerDiaSemana - 1); i++) {
    dias.push(null)
  }
  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i)
  }

  // Función para seleccionar un día
  const seleccionarDia = (dia: number) => {
    const mesString = String(mes + 1).padStart(2, '0')
    const diaString = String(dia).padStart(2, '0')
    setFechaSeleccionada(`${anio}-${mesString}-${diaString}`)
  }

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <NavTabs />
      <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== LADO IZQUIERDO ===== */}
        <div className="bg-background border border-border rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-titulo">Atenciones</h2>
            <span className="font-subtitulo">{fechaSeleccionada}</span>
          </div>
          {atencionesHoy.length > 0 ? (
            <ul>
              {atencionesHoy.map((a, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b border-border py-2"
                >
                  <span className="font-parrafo">
                    {a.nombre} {a.paralelo} {a.turno}
                  </span>
                  <span className="text-sm text-foreground">{a.hora}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-parrafo text-gray-500">
              No hay atenciones para esta fecha.
            </p>
          )}
        </div>

        {/* ===== LADO DERECHO (CALENDARIO) ===== */}
        <div className="bg-background border border-border rounded-xl shadow p-4">
          {/* Selección de mes y año */}
          <div className="flex justify-center gap-4 mb-4">
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="p-2 border border-border rounded font-subtitulo"
            >
              {meses.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="w-24 p-2 border border-border rounded font-subtitulo"
            />
          </div>

          {/* Calendario en grilla */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
              <div key={d} className="font-subtitulo text-gray-500">
                {d}
              </div>
            ))}
            {dias.map((dia, i) =>
              dia ? (
                <button
                  key={i}
                  onClick={() => seleccionarDia(dia)}
                  className={`p-2 rounded ${
                    fechaSeleccionada ===
                    `${anio}-${String(mes + 1).padStart(2, '0')}-${String(
                      dia
                    ).padStart(2, '0')}`
                      ? 'bg-primary text-white'
                      : 'hover:bg-secondary/30'
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
    </div>
  )
}
