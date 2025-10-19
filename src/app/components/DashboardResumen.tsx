'use client'

import { useEffect, useState } from 'react'
import { getDashboardResumen } from '@/services/dashboard'

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
  }, []) // 👈👈 IMPORTANTE: array vacío para evitar el loop

  if (loading)
    return <p className="text-center text-[var(--muted)]">Cargando resumen...</p>

  if (error)
    return <p className="text-center text-red-500">{error}</p>

  if (!data)
    return <p className="text-center text-[var(--muted)]">Sin datos disponibles</p>

  const cards = [
    { title: 'Atenciones Totales', value: data.atencionesTotales },
    { title: 'Estudiantes Atendidos', value: data.estudiantesAtendidos },
    { title: 'Medicamentos Administrados', value: data.medicamentosAdministrados },
    { title: 'Casos con Baja', value: data.casosConBaja },
    { title: 'Atenciones de Hoy', value: data.atencionesHoy },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-[var(--background)] border border-[var(--border)] shadow-md rounded-xl p-4 text-center hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">
            {card.title}
          </h3>
          <p className="text-3xl font-bold text-[var(--foreground)]">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
