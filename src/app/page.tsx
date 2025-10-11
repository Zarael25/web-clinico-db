import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Home() {
  const token = cookies().get('token')?.value

  if (token) {
    // Si tiene token, lo mandamos al panel o dashboard
    redirect('/estudiantes')
  } else {
    // Si no tiene token, al login
    redirect('/auth/login')
  }
}