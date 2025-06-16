export const validateEmpty = (value: string | number | undefined | null): string | undefined => {
  if (value === undefined || value === null) return 'Campo obligatorio';

  if (typeof value === 'number') value = value.toString();

  if (value.trim().length === 0) return 'Campo obligatorio';
  return undefined;
};
