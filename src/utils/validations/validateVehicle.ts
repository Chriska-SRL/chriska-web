export const validateVehicle = (value: string) => {
  if (!value) return 'Este campo es requerido';

  const regex = /^[\p{L}\p{N}\s\-.,()]+$/u;
  if (!regex.test(value)) {
    return 'Contiene caracteres no permitidos';
  }

  if (value.length < 2) return 'Debe tener al menos 2 caracteres';

  return undefined;
};
