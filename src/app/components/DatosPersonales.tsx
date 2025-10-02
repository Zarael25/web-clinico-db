/**
 * Descripción:
 *   Componente principal para mostrar y editar los datos personales clínicos
 *   de un estudiante. Permite visualizar tutores, condición base, alergias
 *   y vacunas, con soporte de edición si el usuario tiene los roles adecuados.
 *
 * Props:
 *   - estudiante (objeto): Datos completos del estudiante (nombre, apellidos, tutores, gestiones, etc.)
 *   - condicionBase (objeto opcional): Contiene los datos iniciales de condición base, alergias y vacunas.
 *   - token (string): Token JWT para autorizar llamadas al backend.
 *
 * Características:
 *   - Muestra tarjetas con información de tutores (embebidos en Estudiante o asociados desde colección `Tutor`).
 *   - Renderiza la condición base, lista de alergias y vacunas.
 *   - Usa modales dedicados para editar cada sección:
 *       • EditarCondicionBaseModal → condición base
 *       • EditarAlergiasModal → lista de alergias
 *       • EditarVacunasModal → lista de vacunas
 *       • EditarTutoresModal → asignar tutores adicionales
 *   - Aplica reglas de roles:
 *       • Solo usuarios con roles `admin` o `enfermeria` pueden editar.
 *   - Sin edición, funciona como un detalle visual de solo lectura.
 *
 * Uso:
 *   <DatosPersonales
 *      estudiante={estudiante}
 *      condicionBase={condicionBase}
 *      token={token}
 *   />
 *
 * Flujo:
 *   1. Render inicial → muestra los datos y botones "Editar" si el usuario puede.
 *   2. Al abrir un modal → se carga formulario con valores actuales.
 *   3. Al guardar cambios → se actualiza backend y se refresca el estado local.
 *
 * Relación con otros componentes:
 *   - ClinicoHistorialPage: Inserta este componente en la sección "Datos".
 *   - Editar*Modal: cada modal gestiona edición granular de un dato específico.
 */

'use client'
import { useState, useEffect } from 'react'
import EditarCondicionBaseModal from '@/app/components/EditarCondicionBaseModal'
import EditarAlergiasModal from '@/app/components/EditarAlergiasModal'
import EditarVacunasModal from '@/app/components/EditarVacunasModal'
import EditarTutoresModal from '@/app/components/EditarTutoresModal'
import { getTutoresConEstudiantes } from '@/services/tutores'

type DatosPersonalesProps = {
  estudiante: any
  condicionBase?: any
  token: string
}

export default function DatosPersonales({ estudiante, condicionBase, token }: DatosPersonalesProps) {
  const [isCondicionModalOpen, setIsCondicionModalOpen] = useState(false)
  const [isAlergiasModalOpen, setIsAlergiasModalOpen] = useState(false)
  const [isVacunasModalOpen, setIsVacunasModalOpen] = useState(false)
  const [isTutoresModalOpen, setIsTutoresModalOpen] = useState(false)

  const [condicion, setCondicion] = useState(condicionBase?.condicion || '')
  const [alergias, setAlergias] = useState<{ alergia: string }[]>(condicionBase?.alergias || [])
  const [vacunas, setVacunas] = useState<{ vacuna: string }[]>(condicionBase?.vacunas || [])

  const [tutoresExtra, setTutoresExtra] = useState<any[]>([])
  const [rolesUsuario, setRolesUsuario] = useState<string[]>([])

  
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

  
  const puedeEditar = rolesUsuario.includes('admin') || rolesUsuario.includes('enfermeria')

  
  const fetchTutoresExtra = async () => {
    try {
      const data = await getTutoresConEstudiantes(token)
      const filtrados = data.tutores.filter((t: any) =>
        t.estudiantes.some((e: any) => e._id === estudiante._id)
      )
      setTutoresExtra(filtrados)
    } catch (err) {
      console.error('❌ Error al cargar tutores extra', err)
    }
  }

  useEffect(() => {
    if (estudiante?._id && token) {
      fetchTutoresExtra()
    }
  }, [estudiante, token])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">Datos Personales</h2>

      {/* Tutores */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-subtitulo text-[var(--foreground)]">Tutores</h3>
          {puedeEditar && (
            <button
              onClick={() => setIsTutoresModalOpen(true)}
              className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-sm font-parrafo 
                         hover:bg-[var(--secondary)] transition-colors ml-2"
            >
              Añadir Tutor
            </button>
          )}
        </div>

        {(estudiante?.tutores?.length > 0 || tutoresExtra.length > 0) ? (
          <div className="flex flex-wrap gap-3">
            {/* Tutores embebidos en documento Estudiante */}
            {estudiante.tutores.map((tutor: any, idx: number) => (
              <div
                key={`est-${idx}`}
                className="p-4 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)] min-w-[150px]"
              >
                <h4 className="text-md font-semibold text-[var(--primary)] mb-2">
                  {tutor.nombre} {tutor.apellido}
                </h4>
                <p className="text-sm"><strong>Parentesco:</strong> {tutor.parentesco}</p>
                <p className="text-sm"><strong>Celular:</strong> {tutor.celular || '—'}</p>
              </div>
            ))}

            {/* Tutores asignados desde colección Tutor.ts */}
            {tutoresExtra.map((tutor: any) => (
              <div
                key={`extra-${tutor._id}`}
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

      <EditarVacunasModal
        isOpen={isVacunasModalOpen}
        onClose={() => setIsVacunasModalOpen(false)}
        estudianteId={estudiante._id}
        token={token}
        onUpdated={(nuevasVacunas) => setVacunas(nuevasVacunas)}
      />

      {/* Modal Tutores */}
      <EditarTutoresModal
        isOpen={isTutoresModalOpen}
        onClose={() => setIsTutoresModalOpen(false)}
        estudianteId={estudiante._id}
        token={token}
        onUpdated={fetchTutoresExtra}
      />
    </div>
  )
}
