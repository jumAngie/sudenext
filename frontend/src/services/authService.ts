const API_URL = import.meta.env.VITE_API_URL;

export async function loginStudentAPI(identifier: string, password: string) {
    const res = await fetch(`${API_URL}/Estudiantes/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            est_NumeroCuenta: identifier,
            est_Contra: password,
        }),
    });

    const result = await res.json();
    if (!result.success) {
        return { success: false, message: result.message ?? "Credenciales incorrectas" };
    }
    return {
        success: true,
        student: result.data,
    };
}

export async function loginStaffAPI(username: string, password: string) {
    const res = await fetch(`${API_URL}/Usuarios/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usu_Usuario: username,
            usu_Contrasena: password,
        }),
    });

    const result = await res.json();

    if (!result.success) {
        return {
            success: false,
            message: result.message || "Credenciales incorrectas"
        };
    }

    return {
        success: true,
        staff: result.data, // incluye rol, área, etc.
        message: result.data.messageStatus
    };
}
