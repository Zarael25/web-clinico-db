'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavTabs() {
  const pathname = usePathname()

  // Función para aplicar estilos activos
  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-t-lg font-subtitulo transition-colors duration-300 ${
      pathname === path
        ? 'bg-primary text-white shadow-md'
        : 'bg-background text-foreground border border-border hover:bg-secondary/20'
    }`

  return (
    <nav className="flex gap-4 border-b border-border bg-background px-6">
      <Link href="/estudiantes" className={linkClasses('/estudiantes')}>
        Estudiantes
      </Link>
      <Link
        href="/clinico-calendario"
        className={linkClasses('/clinico-calendario')}
      >
        Calendario
      </Link>
    </nav>
  )
}
