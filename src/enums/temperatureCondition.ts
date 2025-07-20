// @/enums/temperatureCondition.enum.ts
export enum TemperatureCondition {
  FROZEN = 'Frozen',
  REFRIGERATED = 'Refrigerated',
  ROOM_TEMPERATURE = 'RoomTemperature',
}

// Mapeo para mostrar en español
export const TemperatureConditionLabels: Record<TemperatureCondition, string> = {
  [TemperatureCondition.FROZEN]: 'Congelado',
  [TemperatureCondition.REFRIGERATED]: 'Refrigerado',
  [TemperatureCondition.ROOM_TEMPERATURE]: 'Temperatura ambiente',
};

// Función helper para obtener el label
export const getTemperatureConditionLabel = (condition: TemperatureCondition | string): string => {
  if (!condition || condition === '') return 'Sin condición';
  if (isValidTemperatureCondition(condition)) {
    return TemperatureConditionLabels[condition];
  }
  return 'Condición desconocida';
};

// Array de opciones para selects
export const TemperatureConditionOptions = Object.entries(TemperatureConditionLabels).map(([key, label]) => ({
  value: key as TemperatureCondition,
  label,
}));

// Validador de tipo
export const isValidTemperatureCondition = (value: string): value is TemperatureCondition => {
  return Object.values(TemperatureCondition).includes(value as TemperatureCondition);
};
