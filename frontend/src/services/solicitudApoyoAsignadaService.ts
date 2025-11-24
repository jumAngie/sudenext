const API_URL = import.meta.env.VITE_API_URL;

// INSERTAR
export async function createSolicitudApoyoAsignadaAPI(payload: any) {
    const response = await fetch(`${API_URL}/SolicitudApoyoAsignada/Insertar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateSolicitudApoyoAsignadaAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudApoyoAsignada/Editar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteSolicitudApoyoAsignadaAPI(payload: any) {
    const res = await fetch(`${API_URL}/SolicitudApoyoAsignada/Eliminar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}