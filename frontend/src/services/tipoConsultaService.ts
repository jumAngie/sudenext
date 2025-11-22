const API_URL = import.meta.env.VITE_API_URL;

// LISTAR
export async function fetchTipoConsultas() {
  const res = await fetch(`${API_URL}/TipoConsulta/Listar`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Error al obtener los registros");
  }
  const json = await res.json();
  return json.data;
}


// INSERTAR
export async function createTipoConsultaAPI(payload:any) {
  const response = await fetch(`${API_URL}/TipoConsulta/Insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateTipoConsultaAPI(payload: any) {
  const res = await fetch(`${API_URL}/TipoConsulta/Editar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteTipoConsultaAPI(payload: any) {
  const res = await fetch(`${API_URL}/TipoConsulta/Eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}