const API_URL = import.meta.env.VITE_API_URL;

// LISTAR
export async function fetchSolicitudCitaOdon() {
    const res = await fetch(`${API_URL}/SolicitudCitaOdon/Listar`, {
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
export async function createSolicitudCitaOdonAPI(payload: any) {
    const response = await fetch(`${API_URL}/SolicitudCitaOdon/Insertar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateSolicitudCitaOdonAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudCitaOdon/Editar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteSolicitudCitaOdonAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudCitaOdon/Eliminar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}