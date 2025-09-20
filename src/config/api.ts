const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.101:3000";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/v1/auth/signin/`,
    REGISTER: `${API_BASE_URL}/v1/auth/signup/`,
    ME: `${API_BASE_URL}/v1/auth/me`,   // 👈 nuevo endpoint
  },
  USUARIOS: {
    LIST: `${API_BASE_URL}/v1/usuarios/`,
    DETALLE: (id: string) => `${API_BASE_URL}/v1/usuarios/${id}/`,
  },
  ESTUDIANTES: {
    LIST: `${API_BASE_URL}/v1/estudiantes/`,     // todos los estudiantes
    DETALLE: (id: string) => `${API_BASE_URL}/v1/estudiantes/${id}/`, // buscar por id o RUDE
    BUSCAR: `${API_BASE_URL}/v1/estudiantes/buscar/`, // 👈 buscador
  },

  CONDICION_BASE: {
    DETALLE: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}`, // 👈 nuevo
    EDITAR: (idUsuario: string) =>
      `${API_BASE_URL}/v1/condicion-base/${idUsuario}/condicion`, // 👈 PATCH


        //  NUEVOS ENDPOINTS PARA ALERGIAS
    ALERGIAS: {
      GET: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/alergias`, // GET todas
      PUT: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/alergias`, // reemplazar lista
      PATCH: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/alergias`, // añadir una
    },

    //  luego puedes hacer lo mismo para vacunas)
    VACUNAS: {
      GET: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/vacunas`,
      PUT: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/vacunas`,
      PATCH: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/vacunas`,
    },

  },


  ATENCIONES: {
    CREATE: `${API_BASE_URL}/v1/atenciones/`,
    DETALLE: (id: string) => `${API_BASE_URL}/v1/atenciones/${id}`,
    POR_ESTUDIANTE: (id: string) =>
      `${API_BASE_URL}/v1/atenciones/estudiante/${id}`,
  },


  MEDICAMENTOS: {
    LIST: `${API_BASE_URL}/v1/medicamentos/`,
  },

};
