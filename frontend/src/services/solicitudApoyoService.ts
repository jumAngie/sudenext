const API_URL = import.meta.env.VITE_API_URL;

// LISTAR
export async function fetchSolicitudApoyo() {
    const res = await fetch(`${API_URL}/SolicitudApoyo/Listar`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) {
        throw new Error("Error al obtener las solicitudes");
    }
    const json = await res.json();
    return json.data;
}


// INSERTAR
export async function createSolicitudApoyoAPI(payload: any) {
    const response = await fetch(`${API_URL}/SolicitudApoyo/Insertar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateSolicitudApoyoAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudApoyo/Editar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteSolicitudApoyoAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudApoyo/Eliminar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}