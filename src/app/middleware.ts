/**
 * Descripción:
 *   Middleware global de Next.js encargado de proteger las rutas de la aplicación
 *   mediante autenticación con JWT guardado en cookies.
 *   Redirige a la pantalla de login si el usuario no tiene token o si el token es inválido.
 *
 * Flujo:
 *   1. Se obtiene el token de las cookies (`req.cookies.get('token')`).
 *   2. Se define la lista de rutas públicas (`/auth/login`) que no requieren autenticación.
 *   3. Si NO hay token y la ruta no es pública → se redirige a `/auth/login`.
 *   4. Si hay token:
 *        - Se valida contra el endpoint del backend (`/v1/auth/me`).
 *        - Si la validación falla → redirige a `/auth/login`.
 *        - Si el usuario intenta acceder a `/auth/login` estando autenticado → redirige a `/estudiantes`.
 *   5. Si todo es correcto → deja continuar la navegación (`NextResponse.next()`).
 *
 * Características:
 *   - Usa `NEXT_PUBLIC_API_BASE_URL` para validar el token contra el backend.
 *   - Funciona tanto en cliente como en servidor porque el middleware corre en el Edge Runtime.
 *   - Protege cualquier ruta excepto:
 *       - `/auth/login`
 *       - Recursos internos de Next (`/_next`, `favicon.ico`, `/public`).
 *
 * Configuración `matcher`:
 *   - Aplica a todas las rutas (`/`) excepto las carpetas reservadas y assets estáticos.
 *   - Esto asegura que toda la aplicación (salvo login) quede protegida.
 *
 * Ejemplo de Comportamiento:
 *   - Usuario sin token → intenta `/estudiantes` → redirige a `/auth/login`.
 *   - Usuario con token válido → `/estudiantes` → acceso permitido.
 *   - Usuario con token válido → `/auth/login` → redirige automáticamente a `/estudiantes`.
 */


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || ''
  const { pathname } = req.nextUrl

  const publicPaths = ['/auth/login']

  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (token) {
    
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!resp.ok) {
        
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }

      if (pathname.startsWith('/auth/login')) {
        return NextResponse.redirect(new URL('/estudiantes', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
}
