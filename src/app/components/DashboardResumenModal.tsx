'use client'

import { useEffect, useState } from 'react'
import DashboardResumen from './DashboardResumen'

export default function DashboardResumenModal() {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    console.log('🟢 useEffect ejecutado — verificando si ya se mostró el modal')

    // 🔍 Revisar si ya se mostró en esta sesión
    const mostrado = sessionStorage.getItem('dashboardMostrado')

    if (!mostrado) {
      console.log('✅ Mostrando modal por primera vez')
      setMostrar(true)
      sessionStorage.setItem('dashboardMostrado', 'true') // marcar como mostrado
    } else {
      console.log('🚫 Modal ya mostrado en esta sesión')
    }
  }, [])

  if (!mostrar) return null

  console.log('🎯 Modal visible en el DOM')

  return (
    <div className="fixed inset-0 bg-black/70 text-white flex justify-center items-center z-[99999] animate-fadeIn">
      <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-lg max-w-3xl w-[90%] relative animate-fadeInUp">
        <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4 text-center">
          Resumen General del Sistema
        </h2>

        <DashboardResumen />

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setMostrar(false)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
