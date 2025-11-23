const API_URL = import.meta.env.VITE_API_URL;

// LISTAR
export async function fetchRoles() {
    const res = await fetch(`${API_URL}/Roles/Listar`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) {
        throw new Error("Error al obtener los roles");
    }
    const json = await res.json();
    return json.data;
}


// INSERTAR
export async function createRolesAPI(payload: any) {
    const response = await fetch(`${API_URL}/Roles/Insertar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result.data?.messageStatus || "Error desconocido";
}


// EDITAR
export async function updateRolesAPI(payload: any) {
    const res = await fetch(`${API_URL}/Roles/Editar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}


// ELIMINAR
export async function deleteRolesAPI(payload: any) {
    const res = await fetch(`${API_URL}/Roles/Eliminar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.data?.messageStatus || "Error desconocido";
}