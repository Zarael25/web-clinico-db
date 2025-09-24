'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Usuario = {
  _id: string
  nombre: string
  roles: string[] // 👈 importante: tu usuario debe tener un array de roles
}

type NavTabsProps = {
  children?: React.ReactNode
}

export default function NavTabs({ children }: NavTabsProps) {
  const pathname = usePathname()
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('usuario')
    if (stored) {
      setUsuario(JSON.parse(stored))
    }
  }, [])

  // ✅ función para aplicar estilos activos
  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-t-lg font-subtitulo transition-colors duration-300 ${
      pathname === path
        ? 'bg-[var(--primary)] text-white shadow-md'
        : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
    }`

  // 👉 roles que pueden ver Medicamentos y Tutores
  const rolesPermitidos = ['admin', 'enfermeria']
  const puedeVerExtras = usuario?.roles?.some((r) =>
    rolesPermitidos.includes(r)
  )

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

        {/* 👉 solo admin y enfermería */}
        {puedeVerExtras && (
          <>
            <Link
              href="/clinico-medicamentos"
              className={linkClasses('/clinico-medicamentos')}
            >
              Medicamentos
            </Link>
            <Link
              href="/clinico-tutores"
              className={linkClasses('/clinico-tutores')}
            >
              Tutores
            </Link>
          </>
        )}
      </div>

      {/* 👉 Controles extra (ej: reporte) a la derecha */}
      <div className="flex items-center gap-2">{children}</div>
    </nav>
  )
}
