'use client'

import CondicionBaseDetalle from './CondicionBaseDetalle'
import { useEffect, useState } from 'react'
import { crearAtencion } from '@/services/atenciones'
import { getMedicamentos } from '@/services/medicamentos'

type AgregarAtencionProps = {
  condicion?: string
  alergias?: { alergia: string }[] | string[]
  vacunas?: { vacuna: string }[] | string[]
  estudianteId: string
  token: string
}

export default function AgregarAtencion({
  condicion = '',
  alergias = [],
  vacunas = [],
  estudianteId,
  token,
}: AgregarAtencionProps) {
  const [motivo, setMotivo] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [tratamiento, setTratamiento] = useState('')
  const [sugerirBaja, setSugerirBaja] = useState(false)

  const [medicamentosDisponibles, setMedicamentosDisponibles] = useState<any[]>([])
  const [medicamentosSeleccionados, setMedicamentosSeleccionados] = useState<
    { medicamento: string; dosis: string; via: string }[]
  >([])

  useEffect(() => {
    if (token) {
      getMedicamentos(token)
        .then((data) => setMedicamentosDisponibles(data))
        .catch((err) => console.error('Error cargando medicamentos:', err))
    }
  }, [token])

  const handleSelectMedicamento = (id: string) => {
    if (!medicamentosSeleccionados.find((m) => m.medicamento === id)) {
      setMedicamentosSeleccionados([
        ...medicamentosSeleccionados,
        { medicamento: id, dosis: '', via: 'ORAL' },
      ])
    }
  }

  const handleRemoveMedicamento = (id: string) => {
    setMedicamentosSeleccionados(medicamentosSeleccionados.filter((m) => m.medicamento !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const nuevaAtencion = await crearAtencion(
        estudianteId,
        motivo,
        diagnostico,
        tratamiento,
        sugerirBaja,
        token,
        medicamentosSeleccionados
      )
      console.log('✅ Atención creada:', nuevaAtencion)
      alert('Atención registrada con éxito')
    } catch (error) {
      console.error('❌ Error al registrar la atención:', error)
      alert('Error al registrar la atención')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-titulo text-[var(--primary)] mb-4">Agregar Atención</h2>

      {/* 👇 Mostramos primero la info clínica base */}
      <CondicionBaseDetalle condicion={condicion} alergias={alergias} vacunas={vacunas} />

      {/* 👇 Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-semibold">Motivo de consulta</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Diagnóstico</label>
          <input
            type="text"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Tratamiento</label>
          <input
            type="text"
            value={tratamiento}
            onChange={(e) => setTratamiento(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sugerirBaja}
            onChange={(e) => setSugerirBaja(e.target.checked)}
          />
          <label className="text-sm">Sugerir baja</label>
        </div>

        {/* 👉 Selección de medicamentos */}
        <div>
          <label className="block text-sm font-semibold mb-2">Medicamentos</label>
          <select
            className="w-full border rounded-lg px-3 py-2 
                      bg-[var(--background)] text-[var(--foreground)] 
                      focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            onChange={(e) => handleSelectMedicamento(e.target.value)}
          >
            <option value="">-- Seleccionar medicamento --</option>
            {medicamentosDisponibles.map((med) => (
              <option
                key={med._id}
                value={med._id}
                className="bg-[var(--background)] text-[var(--foreground)]"
              >
                {med.nombre_comercial} ({med.presentacion})
              </option>
            ))}
          </select>

          <div className="mt-3 space-y-3">
            {medicamentosSeleccionados.map((medSel, idx) => {
              const medInfo = medicamentosDisponibles.find((m) => m._id === medSel.medicamento)
              return (
                <div
                  key={idx}
                  className="border border-[var(--border)] rounded-lg p-3 flex flex-col gap-2"
                >
                  <p className="font-semibold">
                    {medInfo?.nombre_comercial} — {medInfo?.presentacion}
                  </p>
                  <input
                    type="text"
                    placeholder="Dosis"
                    value={medSel.dosis}
                    onChange={(e) => {
                      const newMeds = [...medicamentosSeleccionados]
                      newMeds[idx].dosis = e.target.value
                      setMedicamentosSeleccionados(newMeds)
                    }}
                    className="w-full border rounded-lg px-3 py-1"
                  />
                  <select
                    value={medSel.via}
                    onChange={(e) => {
                      const newMeds = [...medicamentosSeleccionados]
                      newMeds[idx].via = e.target.value
                      setMedicamentosSeleccionados(newMeds)
                    }}
                    className="w-full border rounded-lg px-3 py-1"
                  >
                    <option value="ORAL">ORAL</option>
                    <option value="INTRAVENOSA">INTRAVENOSA</option>
                    <option value="INTRAMUSCULAR">INTRAMUSCULAR</option>
                    <option value="SUBCUTANEA">SUBCUTANEA</option>
                    <option value="TOPICA">TOPICA</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicamento(medSel.medicamento)}
                    className="text-red-600 text-sm mt-1"
                  >
                    ❌ Quitar
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[var(--secondary)] transition-colors"
        >
          Guardar Atención
        </button>
      </form>
    </div>
  )
}
