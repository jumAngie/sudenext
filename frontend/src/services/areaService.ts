const API_URL = import.meta.env.VITE_API_URL;

// LISTAR
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


// INSERTAR
export async function createAreaAPI(payload:any) {
  const response = await fetch(`${API_URL}/Areas/Insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateAreaAPI(payload: any) {
  const res = await fetch(`${API_URL}/Areas/Editar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteAreaAPI(payload: any) {
  console.log(payload);
  const res = await fetch(`${API_URL}/Areas/Eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}
