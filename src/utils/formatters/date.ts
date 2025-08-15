export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // Si la fecha viene en formato UTC (termina en Z), usamos UTC para evitar problemas de zona horaria
    if (dateString.endsWith('Z') || dateString.includes('T')) {
      return date.toLocaleDateString('es-UY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      });
    }
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};
