'use client'

import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { useEffect, useState } from 'react'

export default function Header() {
  const router = useRouter()
  const [nombreUsuario, setNombreUsuario] = useState<string>('')

  useEffect(() => {
    const nombre = localStorage.getItem('usuario')
    if (nombre) setNombreUsuario(nombre)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/auth/login')
  }

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-background border-b border-border shadow-sm">
      <h1 className="text-4xl font-titulo font-extrabold text-primary tracking-wide">
        Don Bosco Clínico
      </h1>

      <div className="flex items-center gap-4">
        <span className="font-titulo text-2xl font-bold text-foreground">
          {nombreUsuario || 'Usuario'}
        </span>

        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="bg-error text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}
