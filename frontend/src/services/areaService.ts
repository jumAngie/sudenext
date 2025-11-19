export const API_URL = "https://localhost:44327/api";

export async function fetchAreas() {
  const res = await fetch(`${API_URL}/Areas/Listar`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    throw new Error("Error al obtener las áreas");
  }

  const json = await res.json();
  return json.data; // porque la API manda { data: [...] }
}