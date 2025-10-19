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
