'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import NavTabs from '@/app/components/NavTabs'
import DashboardResumen from '@/app/components/DashboardResumen'
import AtencionesPorNivel from '@/app/components/AtencionesPorNivel'

export default function PanelPage() {
  const [token, setToken] = useState('')

  useEffect(() => {
    const cookieToken =
      typeof document !== 'undefined'
        ? document.cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1] || ''
        : ''
    setToken(cookieToken)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <NavTabs />

      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-titulo text-[var(--primary)]">Panel de Control</h1>
        </div>

        {/* 📊 Componente de resumen del dashboard */}
        <DashboardResumen />

        {/* 📈 Estadísticas por nivel */}
        <AtencionesPorNivel />   {/* 👈 agregado aquí */}


      </main>
    </div>
  )
}
