'use client'

import { useEffect, useState } from 'react'
import DashboardResumen from './DashboardResumen'

export default function DashboardResumenModal() {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    console.log('🟢 useEffect — verificando rol y si ya se mostró el modal')

    // 📌 1. Obtener usuario desde localStorage
    const usuarioJSON = localStorage.getItem('usuario')

    if (!usuarioJSON) {
      console.log('🚫 No hay usuario en localStorage')
      return
    }

    const usuario = JSON.parse(usuarioJSON)

    // 📌 2. Obtener roles del usuario (puede ser string o array)
    let rolesUsuario: string[] = []

    if (Array.isArray(usuario.roles)) {
      rolesUsuario = usuario.roles
    } else if (usuario.rol) {
      rolesUsuario = [usuario.rol]
    }

    console.log('🧩 Roles del usuario:', rolesUsuario)

    const rolesPermitidos = ['admin', 'administracion', 'enfermeria']

    // 📌 3. Verificar si el usuario tiene un rol permitido
    const autorizado = rolesUsuario.some((rol) => rolesPermitidos.includes(rol))

    if (!autorizado) {
      console.log('🚫 Usuario sin permisos → No mostrar modal')
      return
    }

    // 📌 4. Verificar si ya se mostró el modal en esta sesión
    const mostrado = sessionStorage.getItem('dashboardMostrado')

    if (!mostrado) {
      console.log('✅ Mostrando modal por primera vez')
      setMostrar(true)
      sessionStorage.setItem('dashboardMostrado', 'true')
    } else {
      console.log('🚫 Modal ya fue mostrado antes en esta sesión')
    }
  }, [])

  if (!mostrar) return null

  return (
    <div className="fixed inset-0 bg-black/70 text-white flex justify-center items-center z-[99999] animate-fadeIn">
      <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-lg max-w-3xl w-[90%] relative animate-fadeInUp">
        <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4 text-center">
          Resumen General del Sistema
        </h2>

        <DashboardResumen />

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setMostrar(false)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
