/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Esto le dice a Vercel que use el modo "standalone"
  // y genere los archivos correctos en `.next/standalone`
  output: 'standalone',

  // Opcional: tus orígenes permitidos durante desarrollo
  allowedDevOrigins: [
    'http://192.168.1.101:3000',
    'http://localhost:4000',
  ],

  // (opcional) permite imágenes externas si las usas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // o un dominio específico como "res.cloudinary.com"
      },
    ],
  },
}

export default nextConfig