const API_URL = import.meta.env.VITE_API_URL;

// LISTAR
export async function fetchCitaOdonDiagnostico() {
  const res = await fetch(`${API_URL}/CitaOdonDiagnostico/Listar`, {
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
export async function createUsuarioAPI(payload:any) {
  const response = await fetch(`${API_URL}/CitaOdonDiagnostico/Insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateUsuarioAPI(payload: any) {
  const res = await fetch(`${API_URL}/CitaOdonDiagnostico/Editar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteUsuarioAPI(payload: any) {
  const res = await fetch(`${API_URL}/CitaOdonDiagnostico/Eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}