export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};
