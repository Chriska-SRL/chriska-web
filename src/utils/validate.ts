export const validateEmpty = (value: string) => {
  if (!value || value.trim().length === 0) return 'Campo obligatorio';
  return undefined;
};
