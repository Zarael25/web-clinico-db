/**
 * Descripción:
 *   Botón de alternancia de tema (claro/oscuro).
 *   Permite al usuario cambiar entre el modo claro y oscuro de la aplicación,
 *   guardando la preferencia en `localStorage` y aplicando la clase `dark`
 *   en el elemento raíz (`<html>`).
 *
 * Estado:
 *   - darkMode (boolean): Indica si el modo oscuro está activo.
 *
 * Flujo:
 *   1. Al montarse, revisa `localStorage` para obtener el tema previamente guardado.
 *   2. Si no existe en `localStorage`, consulta la preferencia del sistema (`prefers-color-scheme: dark`).
 *   3. Aplica la clase `dark` al `<html>` según la preferencia detectada y actualiza el estado.
 *   4. Cuando el usuario hace clic en el botón:
 *        - Si estaba en modo oscuro → cambia a claro, guarda en `localStorage` como `"light"`.
 *        - Si estaba en modo claro → cambia a oscuro, guarda en `localStorage` como `"dark"`.
 *
 * Características:
 *   - Persistencia del tema entre sesiones con `localStorage`.
 *   - Compatibilidad con la preferencia del sistema operativo.
 *   - Cambia dinámicamente los estilos aplicados en la app mediante Tailwind CSS (`dark:`).
 *   - Botón con estilos dinámicos (`bg-[var(--primary)]`, `hover:bg-[var(--secondary)]`).
 *
 * Uso:
 *   <ThemeToggle />
 *
 * Ejemplo de integración:
 *   Dentro del header o layout de la app para permitir al usuario alternar fácilmente el tema:
 *
 *   <header>
 *     <h1>Mi Aplicación</h1>
 *     <ThemeToggle />
 *   </header>
 */

'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setDarkMode(false)
    }
  }, [])

  
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setDarkMode(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition-colors"
    >
      {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
    </button>
  )
}
