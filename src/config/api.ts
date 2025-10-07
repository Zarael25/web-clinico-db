/**
 * Descripción:
 *   Archivo de configuración central para todos los endpoints de la API.
 *   Define las rutas del backend agrupadas por módulos (Auth, Usuarios, Estudiantes,
 *   Condición Base, Atenciones, Medicamentos, Tutores). 
 *   Usa `NEXT_PUBLIC_API_BASE_URL` como base, con fallback local.
 *
 * Constantes:
 *   - API_BASE_URL: URL base de la API, configurable por variable de entorno o fallback.
 *   - ENDPOINTS: Objeto que organiza todas las rutas de acceso al backend.
 *
 * Módulos:
 *   AUTH:
 *     - LOGIN: Inicio de sesión de usuario.
 *     - REGISTER: Registro de nuevos usuarios.
 *     - ME: Obtiene información del usuario autenticado.
 *
 *   USUARIOS:
 *     - LIST: Listado de usuarios.
 *     - DETALLE(id): Obtiene detalle de un usuario por ID.
 *
 *   ESTUDIANTES:
 *     - LIST: Listado de estudiantes.
 *     - DETALLE(id): Obtiene detalle de un estudiante por ID.
 *     - BUSCAR: Endpoint para búsqueda de estudiantes (nombre, curso, RUDE).
 *
 *   CONDICION_BASE:
 *     - DETALLE(id): Obtiene la condición clínica base de un estudiante.
 *     - EDITAR(idUsuario): Edita la condición base.
 *     - ALERGIAS.GET/PUT/PATCH(id): Operaciones CRUD sobre alergias.
 *     - VACUNAS.GET/PUT/PATCH(id): Operaciones CRUD sobre vacunas.
 *
 *   ATENCIONES:
 *     - CREATE: Crear nueva atención.
 *     - DETALLE(id): Detalle de una atención por ID.
 *     - POR_ESTUDIANTE(id): Atenciones vinculadas a un estudiante.
 *     - POR_FECHA(fecha): Atenciones filtradas por fecha.
 *     - REPORTE(anio?, mes?, dia?): Genera reporte PDF dinámico según parámetros.
 *
 *   MEDICAMENTOS:
 *     - LIST: Listado de medicamentos.
 *     - DETALLE(id): Detalle de medicamento por ID.
 *
 *   TUTORES:
 *     - LIST: Listado de tutores.
 *     - CON_ESTUDIANTES: Tutores con estudiantes asignados (join).
 *     - DETALLE(id): Detalle de tutor por ID.
 *     - EDITAR(id): Actualiza datos de tutor.
 *     - ADD_ESTUDIANTE(id): Asocia un estudiante a un tutor.
 *     - REMOVE_ESTUDIANTE(id, estudianteId): Remueve un estudiante de un tutor.
 *
 * Características:
 *   - Centralización de rutas → evita hardcodear URLs en los servicios.
 *   - Soporte para endpoints dinámicos con parámetros (`id`, `fecha`, etc.).
 *   - Fácil mantenimiento y escalabilidad al añadir nuevos módulos.
 *
 */





const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-clinico-db.vercel.app";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/v1/auth/signin/`,
    REGISTER: `${API_BASE_URL}/v1/auth/signup/`,
    ME: `${API_BASE_URL}/v1/auth/me`,   
  },
  USUARIOS: {
    LIST: `${API_BASE_URL}/v1/usuarios/`,
    DETALLE: (id: string) => `${API_BASE_URL}/v1/usuarios/${id}/`,
  },
  ESTUDIANTES: {
    LIST: `${API_BASE_URL}/v1/estudiantes/`,     
    DETALLE: (id: string) => `${API_BASE_URL}/v1/estudiantes/${id}/`, 
    BUSCAR: `${API_BASE_URL}/v1/estudiantes/buscar/`, 
  },

  CONDICION_BASE: {
    DETALLE: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}`, 
    EDITAR: (idUsuario: string) =>
      `${API_BASE_URL}/v1/condicion-base/${idUsuario}/condicion`, 


        
    ALERGIAS: {
      GET: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/alergias`, 
      PUT: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/alergias`, 
      PATCH: (id: string) => `${API_BASE_URL}/v1/condicion-base/${id}/alergias`, 
    },

    
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
    POR_FECHA: (fecha: string) =>
      `${API_BASE_URL}/v1/atenciones/fecha?fecha=${fecha}`,

    REPORTE: (anio?: string, mes?: string, dia?: string) => {
      let url = `${API_BASE_URL}/v1/atenciones/reporte/pdf?`
      if (anio) url += `anio=${anio}&`
      if (mes) url += `mes=${mes}&`
      if (dia) url += `dia=${dia}&`
      return url.slice(0, -1) 
    },

  },


  MEDICAMENTOS: {
    LIST: `${API_BASE_URL}/v1/medicamentos/`, 
    DETALLE: (id: string) => `${API_BASE_URL}/v1/medicamentos/${id}`,
  },


  TUTORES: {
    LIST: `${API_BASE_URL}/v1/tutores/`, 
    CON_ESTUDIANTES: `${API_BASE_URL}/v1/tutores/con-estudiantes`, 
    DETALLE: (id: string) => `${API_BASE_URL}/v1/tutores/${id}`, 
    EDITAR: (id: string) => `${API_BASE_URL}/v1/tutores/${id}`, 
    ADD_ESTUDIANTE: (id: string) =>
      `${API_BASE_URL}/v1/tutores/${id}/add-estudiante`, 
    REMOVE_ESTUDIANTE: (id: string, estudianteId: string) =>
      `${API_BASE_URL}/v1/tutores/${id}/remove-estudiante/${estudianteId}`, 
  },



};
