'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  // Detecta preferencia del sistema al cargar el componente
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Cambia el tema y actualiza la clase en <html>
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-primary text-white"
      aria-label="Toggle dark mode"
    >
      {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
    </button>
  )
}