'use client'

import { useEffect, useState } from 'react'
import { getAtencionesPorNivel } from '@/services/dashboard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

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

  if (loading) return <p className="text-center text-[var(--muted)]">Cargando estadísticas...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!data.length) return <p className="text-center text-[var(--muted)]">Sin datos disponibles</p>

  return (
    <div className="mt-8 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-md p-4">
      <h2 className="text-xl font-titulo text-[var(--primary)] mb-4 text-center">
        Atenciones y Estudiantes Atendidos por Nivel
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="nivel" stroke="var(--foreground)" />
          <YAxis stroke="var(--foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            }}
          />
          <Legend />
          <Bar dataKey="totalAtenciones" fill="var(--primary)" name="Atenciones" />
          <Bar dataKey="estudiantesAtendidos" fill="var(--secondary)" name="Estudiantes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
