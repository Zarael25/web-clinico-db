'use client'
import { useState, useEffect } from 'react'
import EditarCondicionBaseModal from '@/app/components/EditarCondicionBaseModal'
import EditarAlergiasModal from '@/app/components/EditarAlergiasModal'
import EditarVacunasModal from '@/app/components/EditarVacunasModal'

type DatosPersonalesProps = {
  estudiante: any
  condicionBase?: any
  token: string
}

export default function DatosPersonales({ estudiante, condicionBase, token }: DatosPersonalesProps) {
  const [isCondicionModalOpen, setIsCondicionModalOpen] = useState(false)
  const [isAlergiasModalOpen, setIsAlergiasModalOpen] = useState(false)
  const [isVacunasModalOpen, setIsVacunasModalOpen] = useState(false)

  const [condicion, setCondicion] = useState(condicionBase?.condicion || '')
  const [alergias, setAlergias] = useState<{ alergia: string }[]>(condicionBase?.alergias || [])
  const [vacunas, setVacunas] = useState<{ vacuna: string }[]>(condicionBase?.vacunas || [])

  const [rolesUsuario, setRolesUsuario] = useState<string[]>([])

  // 🔎 Leer roles del usuario desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const usuarioStr = localStorage.getItem('usuario')
      if (usuarioStr) {
        try {
          const usuario = JSON.parse(usuarioStr)
          setRolesUsuario(usuario.roles || [])
        } catch (err) {
          console.error('Error parseando usuario desde localStorage:', err)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (condicionBase?.condicion) setCondicion(condicionBase.condicion)
    if (condicionBase?.alergias) setAlergias(condicionBase.alergias)
    if (condicionBase?.vacunas) setVacunas(condicionBase.vacunas)
  }, [condicionBase])

  // ✅ Solo admin o enfermeria pueden editar
  const puedeEditar = rolesUsuario.includes('admin') || rolesUsuario.includes('enfermeria')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">Datos Personales</h2>

      {/* Tutores */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-subtitulo text-[var(--foreground)] mb-4">Tutores</h3>
        {estudiante?.tutores?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {estudiante.tutores.map((tutor: any, idx: number) => (
              <div
                key={idx}
                className="p-4 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] min-w-[150px]"
              >
                <h4 className="text-md font-semibold text-[var(--primary)] mb-2">
                  {tutor.nombre} {tutor.apellido}
                </h4>
                <p className="text-sm"><strong>Parentesco:</strong> {tutor.parentesco}</p>
                <p className="text-sm"><strong>Celular:</strong> {tutor.celular || '—'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No hay tutores registrados</p>
        )}
      </div>

      {/* Condición base */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">Condición base</h3>
          {puedeEditar && (
            <button
              onClick={() => setIsCondicionModalOpen(true)}
              className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                         hover:bg-[var(--secondary)] transition-colors ml-2"
            >
              Editar
            </button>
          )}
        </div>

        {condicion ? (
          <div className="inline-block px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm">
            {condicion}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registrada</p>
        )}
      </div>

      {/* Modal Condición */}
      <EditarCondicionBaseModal
        isOpen={isCondicionModalOpen}
        onClose={() => setIsCondicionModalOpen(false)}
        estudianteId={estudiante._id}
        condicionActual={condicion}
        token={token}
        onUpdated={(nuevaCondicion) => setCondicion(nuevaCondicion)}
      />

      {/* Alergias */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">Alergias</h3>
          {puedeEditar && (
            <button
              onClick={() => setIsAlergiasModalOpen(true)}
              className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                         hover:bg-[var(--secondary)] transition-colors ml-2"
            >
              Editar
            </button>
          )}
        </div>

        {alergias?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {alergias.map((a, idx) => (
              <div
                key={idx}
                className="px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm"
              >
                {a.alergia}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registradas</p>
        )}
      </div>

      {/* Modal Alergias */}
      <EditarAlergiasModal
        isOpen={isAlergiasModalOpen}
        onClose={() => setIsAlergiasModalOpen(false)}
        estudianteId={estudiante._id}
        token={token}
        onUpdated={(nuevasAlergias) => setAlergias(nuevasAlergias)}
      />

      {/* Vacunas */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">Vacunas</h3>
          {puedeEditar && (
            <button
              onClick={() => setIsVacunasModalOpen(true)}
              className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                         hover:bg-[var(--secondary)] transition-colors ml-2"
            >
              Editar
            </button>
          )}
        </div>

        {vacunas?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {vacunas.map((v, idx) => (
              <div
                key={idx}
                className="px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] text-sm"
              >
                {v.vacuna}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/70">No registradas</p>
        )}
      </div>

      {/* Modal Vacunas */}
      <EditarVacunasModal
        isOpen={isVacunasModalOpen}
        onClose={() => setIsVacunasModalOpen(false)}
        estudianteId={estudiante._id}
        token={token}
        onUpdated={(nuevasVacunas) => setVacunas(nuevasVacunas)}
      />
    </div>
  )
}
