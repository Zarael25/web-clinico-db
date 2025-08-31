// middleware.ts
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
    // Valida el token en backend
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!resp.ok) {
        // Token inválido o expirado
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
