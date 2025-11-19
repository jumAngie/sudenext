export const API_URL = "https://localhost:44327/api";

// LISTAR AREAS
export async function fetchAreas() {
  const res = await fetch(`${API_URL}/Areas/Listar`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    throw new Error("Error al obtener las áreas");
  }

  const json = await res.json();
  return json.data;
}

export async function createAreaAPI(payload: any) {
  const res = await fetch(`${API_URL}/Areas/Insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error insertando área");
}

export async function updateAreaAPI(payload: any) {
  const res = await fetch(`${API_URL}/Areas/Editar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error modificando área");
}

export async function deleteAreaAPI(payload: any) {
  const res = await fetch(`${API_URL}/Areas/Eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error eliminando área");
}