export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getMinDate = (daysFromNow: number = 1) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const getMaxDate = (monthsFromNow: number = 3) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toISOString().split('T')[0];
};

export function getLocalDateTime() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  const local = new Date(now.getTime() - offsetMs);

  return local.toISOString().slice(0, 19); // "2025-11-21T23:15:00"
}

export function convertPreferredTimeToTicks(time: string) {
  // Convertimos rangos a hora específica
  let parsedHour = 0;

  switch (time) {
    case "7-9 AM":
      parsedHour = 7;
      break;
    case "10-12 AM":
      parsedHour = 10;
      break;
    case "1-3 PM":
      parsedHour = 13;
      break;
    case "3-5 PM":
      parsedHour = 15;
      break;
    default:
      return 0; // o podés mandar null si el backend lo acepta
  }

  // Creamos un Date con esa hora
  const date = new Date();
  date.setHours(parsedHour, 0, 0, 0);

  // .NET TimeSpan usa ticks = 100 nanosegundos
  const ticks = date.getHours() * 60 * 60 * 1000 * 10000;

  return ticks;
}

