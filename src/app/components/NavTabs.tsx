'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavTabsProps = {
  children?: React.ReactNode
}

export default function NavTabs({ children }: NavTabsProps) {
  const pathname = usePathname()

  // Función para aplicar estilos activos
  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-t-lg font-subtitulo transition-colors duration-300 ${
      pathname === path
        ? 'bg-[var(--primary)] text-white shadow-md'
        : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
    }`

  return (
    <nav className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6">
      {/* Tabs a la izquierda */}
      <div className="flex gap-4">
        <Link href="/estudiantes" className={linkClasses('/estudiantes')}>
          Estudiantes
        </Link>
        <Link
          href="/clinico-calendario"
          className={linkClasses('/clinico-calendario')}
        >
          Calendario
        </Link>
      </div>

      {/* 👉 Controles extra (reporte) a la derecha */}
      <div className="flex items-center gap-2">{children}</div>
    </nav>
  )
}
