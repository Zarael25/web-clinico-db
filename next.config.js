/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Activa el modo standalone (necesario para despliegue en Vercel)
  output: 'standalone',

  // Opcional: orígenes permitidos durante desarrollo
  allowedDevOrigins: [
    'http://192.168.1.101:3000',
    'http://localhost:4000',
  ],

  // (opcional) permite imágenes externas si usas <Image>
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // puedes poner tu dominio si prefieres
      },
    ],
  },
}

module.exports = nextConfig
