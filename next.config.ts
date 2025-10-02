/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://192.168.1.101:3000', 
    'http://localhost:4000',     
  ],
}

module.exports = nextConfig