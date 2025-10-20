import { ENDPOINTS } from "@/config/api";

export async function getDashboardResumen(token: string) {
  const res = await fetch(ENDPOINTS.DASHBOARD.RESUMEN, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener el resumen del dashboard");
  }

  return await res.json();
}


export async function getAtencionesPorNivel(token: string) {
  const res = await fetch(ENDPOINTS.DASHBOARD.ATENCIONES_NIVEL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Error al obtener las atenciones por nivel")
  }

  return await res.json()
}