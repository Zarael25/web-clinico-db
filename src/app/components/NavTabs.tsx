/**
 * Descripción:
 *   Barra de navegación con pestañas principales para la aplicación clínica.
 *   Muestra enlaces a las secciones principales (Estudiantes, Calendario)
 *   y pestañas adicionales (Medicamentos, Tutores) dependiendo de los roles del usuario.
 *   Además, permite renderizar controles extra en la parte derecha.
 *
 * Props:
 *   - children (React.ReactNode, opcional): Contenido adicional que se muestra a la derecha,
 *     como botones o selectores (ej. descarga de reportes).
 *
 * Flujo:
 *   1. Al montarse, obtiene el usuario desde `localStorage` y lo guarda en `usuario`.
 *   2. Según la ruta activa (`usePathname`), aplica estilos distintos al tab seleccionado.
 *   3. Renderiza siempre:
 *        - Tab "Estudiantes"
 *        - Tab "Calendario"
 *   4. Renderiza pestañas adicionales ("Medicamentos" y "Tutores") sólo si el usuario
 *      tiene rol `admin` o `enfermeria`.
 *   5. Renderiza el contenido recibido en `children` en el extremo derecho de la barra.
 *
 * Características:
 *   - Determina la pestaña activa comparando `pathname` con cada ruta.
 *   - Estilos dinámicos con Tailwind:
 *       - Tab activo → fondo primario y texto blanco.
 *       - Tab inactivo → fondo normal, borde y hover con color secundario.
 *   - Control de permisos por roles.
 *   - Diseño responsivo y flexible para añadir botones o menús adicionales.
 *
 * Uso:
 *   <NavTabs>
 *     <button onClick={handleDescargar} className="btn">Descargar Reporte</button>
 *   </NavTabs>
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Usuario = {
  _id: string
  nombre: string
  roles: string[] 
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

  
  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-t-lg font-subtitulo transition-colors duration-300 ${
      pathname === path
        ? 'bg-[var(--primary)] text-white shadow-md'
        : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20'
    }`

  
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

        {/* solo admin y enfermería */}
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

      {/* Controles extra (ej: reporte) a la derecha */}
      <div className="flex items-center gap-2">{children}</div>
    </nav>
  )
}
