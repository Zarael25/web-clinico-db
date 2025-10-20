'use client'

import { useEffect, useState } from 'react'
import { getDashboardResumen } from '@/services/dashboard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

interface Resumen {
  atencionesTotales: number
  estudiantesAtendidos: number
  medicamentosAdministrados: number
  casosConBaja: number
  atencionesHoy: number
}

export default function DashboardResumen() {
  const [data, setData] = useState<Resumen | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          typeof document !== 'undefined'
            ? document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1]
            : ''

        if (!token) throw new Error('No se encontró token')

        const resumen = await getDashboardResumen(token)
        setData(resumen)
      } catch (err: any) {
        console.error('❌ Error al cargar el resumen:', err)
        setError('No se pudo cargar el resumen del sistema')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading)
    return <p className="text-center text-[var(--muted)]">Cargando resumen...</p>

  if (error)
    return <p className="text-center text-red-500">{error}</p>

  if (!data)
    return <p className="text-center text-[var(--muted)]">Sin datos disponibles</p>

  // 🔹 Datos para las tarjetas
  const cards = [
    { title: 'Atenciones Totales', value: data.atencionesTotales },
    { title: 'Estudiantes Atendidos', value: data.estudiantesAtendidos },
    { title: 'Medicamentos Administrados', value: data.medicamentosAdministrados },
    { title: 'Casos con Baja', value: data.casosConBaja },
    { title: 'Atenciones de Hoy', value: data.atencionesHoy },
  ]

  // 🔹 Datos para la gráfica
  const chartData = [
    { name: 'Atenciones Totales', valor: data.atencionesTotales },
    { name: 'Estudiantes Atendidos', valor: data.estudiantesAtendidos },
    { name: 'Medicamentos', valor: data.medicamentosAdministrados },
    { name: 'Casos con Baja', valor: data.casosConBaja },
    { name: 'Atenciones Hoy', valor: data.atencionesHoy },
  ]

  return (
    <div className="mt-4 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-md p-6">
      <h2 className="text-lg sm:text-xl font-titulo text-[var(--primary)] mb-4 text-center">
        Resumen General del Año
      </h2>

      <>
        {/* 🔹 Tarjetas resumen más compactas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-2">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[var(--background)] border border-[var(--border)] shadow-sm rounded-lg p-3 text-center hover:shadow-md transition"
            >
              <h3 className="text-sm font-semibold text-[var(--primary)] mb-1">
                {card.title}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* 🔹 Gráfica resumen */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--foreground)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--foreground)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                dataKey="valor"
                fill="var(--primary)"
                name="Cantidad"
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    </div>
  )
}
