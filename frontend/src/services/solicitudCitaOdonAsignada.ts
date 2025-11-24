const API_URL = import.meta.env.VITE_API_URL;

// INSERTAR
export async function createSolicitudCitaOdonAsignadaAPI(payload: any) {
    const response = await fetch(`${API_URL}/SolicitudCitaOdonAsignada/Insertar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateSolicitudCitaOdonAsignadaAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudCitaOdonAsignada/Editar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteSolicitudCitaOdonAsignadaAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudCitaOdonAsignada/Eliminar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}