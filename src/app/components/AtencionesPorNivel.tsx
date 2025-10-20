'use client'

import { useEffect, useState } from 'react'
import { getAtencionesPorNivel } from '@/services/dashboard'
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

type NivelData = {
  nivel: string
  totalAtenciones: number
  estudiantesAtendidos: number
}

export default function AtencionesPorNivel() {
  const [data, setData] = useState<NivelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          typeof document !== 'undefined'
            ? document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1]
            : ''

        if (!token) throw new Error('Token no encontrado')

        const result = await getAtencionesPorNivel(token)
        setData(result.data)
      } catch (err: any) {
        console.error('❌ Error al obtener datos por nivel:', err)
        setError('No se pudieron obtener los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading)
    return <p className="text-center text-[var(--muted)]">Cargando estadísticas...</p>

  if (error)
    return <p className="text-center text-red-500">{error}</p>

  if (!data.length)
    return <p className="text-center text-[var(--muted)]">Sin datos disponibles</p>

  return (
    <div className="mt-8 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-md p-6">
      <h2 className="text-lg sm:text-xl font-titulo text-[var(--primary)] mb-4 text-center">
        Atenciones y Estudiantes Atendidos por Nivel
      </h2>

      {/* 🔹 Fichas resumen compactas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {data.map((nivel, index) => (
          <div
            key={index}
            className="bg-[var(--background)] border border-[var(--border)] shadow-sm rounded-lg p-3 text-center hover:shadow-md transition"
          >
            <h3 className="text-sm font-semibold text-[var(--primary)] mb-1">
              Nivel {nivel.nivel}
            </h3>
            <div className="flex flex-col items-center">
              <p className="text-base sm:text-lg font-bold text-[var(--foreground)] leading-tight">
                {nivel.totalAtenciones}
              </p>
              <p className="text-xs text-[var(--muted)]">
                atenciones
              </p>
            </div>
            <div className="flex flex-col items-center mt-1">
              <p className="text-base sm:text-lg font-bold text-[var(--foreground)] leading-tight">
                {nivel.estudiantesAtendidos}
              </p>
              <p className="text-xs text-[var(--muted)]">
                estudiantes
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Gráfica comparativa */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="nivel" stroke="var(--foreground)" tick={{ fontSize: 12 }} />
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
            dataKey="totalAtenciones"
            fill="var(--primary)"
            name="Atenciones"
            animationDuration={1200}
          />
          <Bar
            dataKey="estudiantesAtendidos"
            fill="var(--secondary)"
            name="Estudiantes"
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
