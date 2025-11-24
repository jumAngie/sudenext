export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendiente': return 'bg-yellow-100 text-yellow-800';
    case 'asignada': case 'confirmada': return 'bg-blue-100 text-blue-800';
    case 'completada': return 'bg-green-100 text-green-800';
    case 'rechazada': case 'cancelada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getEmotionalLevelText = (level: number) => {
  const levels = {
    1: 'Muy Bajo',
    2: 'Bajo', 
    3: 'Moderado',
    4: 'Alto',
    5: 'Muy Alto'
  };
  return levels[level as keyof typeof levels] || 'N/A';
};

export const getEmotionalLevelColor = (level: number) => {
  if (level <= 2) return 'bg-green-100 text-green-800';
  if (level === 3) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getRoleDisplay = (role: string) => {
  const roleNames = {
    'administrador': 'Administrador',
    'odontologo': 'Odontólogo', 
    'medico_general': 'Médico General',
    'asesor_academico': 'Asesor Académico',
    'consejero': 'Consejero/Psicólogo'
  };
  return roleNames[role as keyof typeof roleNames] || role;
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'asignada': return 'Asignada';
    case 'confirmada': return 'Confirmada';
    case 'completada': return 'Completada';
    case 'rechazada': return 'Rechazada';
    case 'cancelada': return 'Cancelada';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pendiente': return '⏳';
    case 'asignada': return '👤';
    case 'confirmada': return '✅';
    case 'completada': return '✓';
    case 'rechazada': return '❌';
    case 'cancelada': return '🚫';
    default: return '📋';
  }
};

export const getPriorityText = (priority: string) => {
  const map: Record<string, string> = {
    b: "BAJA",
    m: "MEDIA",
    a: "ALTA"
  };
  return map[priority.toLowerCase()] || "N/A";
};
