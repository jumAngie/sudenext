const API_URL = import.meta.env.VITE_API_URL;

export async function loginStudentAPI(identifier: string, password: string) {
    const res = await fetch(`${API_URL}/Estudiantes/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numeroCuenta: identifier,
            contrasena: password,
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
