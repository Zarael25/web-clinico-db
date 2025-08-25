const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.101:3000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/v1/auth/signin/`,
    REGISTER: `${API_BASE_URL}/v1/auth/signup/`,
  },
  USUARIOS: {
    LIST: `${API_BASE_URL}/v1/usuarios/`,
    DETALLE: (id: string) => `${API_BASE_URL}/v1/usuarios/${id}/`,
  },
  // Agrega más endpoints según tu backend
};