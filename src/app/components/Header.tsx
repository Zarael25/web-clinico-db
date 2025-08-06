'use client'

import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Header() {
    const router = useRouter()

    const handleLogout = () => {
      // Aquí luego limpiarás tokens o sesión, por ahora solo redirige
      router.push('/auth/login')
    }

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-background border-b border-border shadow-sm">
      {/* Título a la izquierda */}
      <h1 className="text-4xl font-titulo font-extrabold text-primary tracking-wide">
        Don Bosco Clínico
      </h1>

      {/* Controles a la derecha */}
      <div className="flex items-center gap-4">
        
        {/* Nombre del usuario (temporal) */}
        <span className="font-titulo text-2xl font-bold text-foreground">
          Alvaro Perez
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