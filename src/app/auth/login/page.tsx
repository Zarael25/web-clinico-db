'use client'

import { useState } from 'react'
import ThemeToggle from '../../components/ThemeToggle'
import { loginUsuario } from '@/services/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    try {
      const data = await loginUsuario(username, password)
      setMensaje(data.message)
      console.log('Token recibido:', data.token)

      // Guardar token en cookie con expiración
      const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString() // 1 hora
      document.cookie = `token=${data.token}; path=/; max-age=3600; samesite=lax`;

      // Redirigir a estudiantes
      router.push('/estudiantes')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-6xl font-titulo font-extrabold tracking-widest mb-12 text-[var(--primary)] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
        DON BOSCO CLÍNICO
      </h1>

      <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/20 to-[var(--primary)]/20 -z-10" />

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--background)] border border-[var(--border)] p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-sm transition-transform hover:scale-105"
      >
        <h2 className="text-4xl font-titulo text-[var(--primary)] mb-6 text-center">
          Iniciar Sesión
        </h2>

        <label
          className="block mb-2 font-subtitulo text-[var(--foreground)]"
          htmlFor="username"
        >
          Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border border-[var(--border)] rounded-xl bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-parrafo placeholder-gray-400"
          placeholder="Ingresa tu usuario"
          required
        />

        <label
          className="block mb-2 font-subtitulo text-[var(--foreground)]"
          htmlFor="password"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-[var(--border)] rounded-xl bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-parrafo placeholder-gray-400"
          placeholder="Ingresa tu contraseña"
          required
        />

        <button
          type="submit"
          className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-subtitulo hover:bg-[var(--secondary)] transition-colors duration-300 shadow-lg hover:shadow-[var(--primary)]/50"
        >
          Entrar
        </button>

        {mensaje && <p className="mt-4 text-green-500 text-center">{mensaje}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  )
}
