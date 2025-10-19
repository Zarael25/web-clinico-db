/**
 * Descripción:
 *   Componente de cabecera principal de la aplicación **Don Bosco Clínico**.
 *   Muestra el título, el nombre del usuario autenticado, el botón para cerrar sesión
 *   y el control de cambio de tema (`ThemeToggle`).
 *
 * Flujo:
 *   1. Obtiene el token desde las cookies (`document.cookie`).
 *   2. Si existe el token:
 *       - Llama a `getMe(token)` para validar la sesión y obtener los datos del usuario.
 *       - Si la respuesta es válida → muestra el nombre completo del usuario.
 *       - Si falla → ejecuta `handleLogout()` (borra la cookie y redirige al login).
 *   3. Si no existe el token → también redirige al login con `handleLogout()`.
 *   4. El botón "Cerrar Sesión" elimina el token de las cookies y envía al login.
 *
 * Props:
 *   - (ninguna) → Es un componente global de cabecera, se renderiza en las páginas principales.
 *
 * Características:
 *   - Usa `useEffect` para validar la sesión al montar el componente.
 *   - Usa `useState` para manejar el nombre del usuario (`nombreUsuario`).
 *   - Estilos consistentes con Tailwind CSS y variables CSS personalizadas (`--primary`, `--foreground`, etc.).
 *   - Incluye `ThemeToggle` para cambiar entre modo claro/oscuro.
 *
 */



'use client'

import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { useEffect, useState } from 'react'
import { getMe } from '@/services/auth'

export default function Header() {
  const router = useRouter()
  const [nombreUsuario, setNombreUsuario] = useState<string>('')

  useEffect(() => {
    
    const token = document.cookie
      .split('; ')
      .find((c) => c.startsWith('token='))
      ?.split('=')[1]

    if (token) {
      getMe(token)
        .then((data) => {
          if (data?.usuario) {
            const nombreCompleto = `${data.usuario.nombre || ''} ${data.usuario.appaterno || ''} ${data.usuario.apmaterno || ''}`.trim()
            setNombreUsuario(nombreCompleto)
          }
        })
        .catch(() => {
          
          handleLogout()
        })
    } else {
      handleLogout()
    }
  }, [])

  const handleLogout = () => {
    
    document.cookie = 'token=; path=/; max-age=0'
    sessionStorage.removeItem('dashboardMostrado')
    
    router.push('/auth/login')
  }

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-[var(--background)] border-b border-[var(--border)] shadow-sm">
      <h1 className="text-4xl font-titulo font-extrabold text-[var(--primary)] tracking-wide">
        Don Bosco Clínico
      </h1>

      <div className="flex items-center gap-4">
        <span className="font-titulo text-2xl font-bold text-[var(--foreground)]">
          {nombreUsuario || 'Usuario'}
        </span>

        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="bg-[var(--error)] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}
