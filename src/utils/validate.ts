export const validate = (value: string | number | undefined | null): string | undefined => {
  if (value === undefined || value === null) return 'Campo obligatorio';

  if (typeof value === 'number') value = value.toString();

  if (value.trim().length === 0) return 'Campo obligatorio';

  // Solo letras (mayúsculas, minúsculas, con tildes), números y espacios
  const validRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/;
  if (!validRegex.test(value)) {
    return 'No se permiten símbolos ni caracteres especiales';
  }

  return undefined;
};
