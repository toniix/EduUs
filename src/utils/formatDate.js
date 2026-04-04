// Función para formatear la fecha
export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

// Función para verificar si una fecha ya pasó
export const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to compare only dates
  return new Date(date) < today;
};

export const formatDatePeruTime = (dateString) => {
  try {
    const date = new Date(dateString);

    // Usar Intl para más control y confiabilidad
    const formatter = new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    // console.log(parts);
    const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));

    return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return null;
  }
};
