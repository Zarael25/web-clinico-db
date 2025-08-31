'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  // Leer preferencia guardada al cargar
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

  // Cambiar tema y guardar en localStorage
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
