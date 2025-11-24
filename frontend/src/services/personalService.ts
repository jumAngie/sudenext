const API_URL = import.meta.env.VITE_API_URL;

// DDL Personal Sin Usuario
export async function fetchPersonalSinUsuario() {
  const res = await fetch(`${API_URL}/Personal/PersonalSinUsuarioDDL`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Error al obtener los registros");
  }
  const json = await res.json();
  return json.data;
}

// DDL Consejero
export async function fetchPersonal_Consejero() {
  const res = await fetch(`${API_URL}/Personal/PersonalConsejeroDDL`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Error al obtener los registros");
  }
  const json = await res.json();
  return json.data;
}

// DDL Odontologo
export async function fetchPersonal_Odontologo() {
  const res = await fetch(`${API_URL}/Personal/PersonalOdontoloDDL`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Error al obtener los registros");
  }
  const json = await res.json();
  return json.data;
}

// LISTAR
export async function fetchPersonal() {
  const res = await fetch(`${API_URL}/Personal/Listar`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Error al obtener el personal");
  }
  const json = await res.json();
  return json.data;
}


// INSERTAR
export async function createPersonalAPI(payload:any) {
  const response = await fetch(`${API_URL}/Personal/Insertar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updatePersonalAPI(payload: any) {
  const res = await fetch(`${API_URL}/Personal/Editar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deletePersonalAPI(payload: any) {
  const res = await fetch(`${API_URL}/Personal/Eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  return result.data?.messageStatus || "Error desconocido";
}