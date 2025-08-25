/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://192.168.1.101:3000', // tu backend
    'http://localhost:4000',     // tu frontend si cambias el puerto
  ],
}

module.exports = nextConfig