const API_URL = import.meta.env.VITE_API_URL;

// LISTAR
export async function fetchTipoTratamientos() {
  const res = await fetch(`${API_URL}/TipoTratamiento/Listar`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Error al obtener los tratamientos");
  }
  const json = await res.json();
  return json.data;
}


// INSERTAR
export async function createTipoTratamientoAPI(payload:any) {
  const response = await fetch(`${API_URL}/TipoTratamiento/Insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateTipoTratamientoAPI(payload: any) {
  const res = await fetch(`${API_URL}/TipoTratamiento/Editar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteTipoTratamientoAPI(payload: any) {
  const res = await fetch(`${API_URL}/TipoTratamiento/Eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}