export enum TemperatureCondition {
  FROZEN = 'Frozen',
  COLD = 'Cold',
  AMBIENT = 'Ambient', //Room temperature
}

export const TemperatureConditionLabels: Record<TemperatureCondition, string> = {
  [TemperatureCondition.FROZEN]: 'Congelado',
  [TemperatureCondition.COLD]: 'Frío',
  [TemperatureCondition.AMBIENT]: 'Temperatura ambiente',
};

export const getTemperatureConditionLabel = (condition: TemperatureCondition | string): string => {
  if (!condition || condition === '') return 'Sin condición';
  if (isValidTemperatureCondition(condition)) {
    return TemperatureConditionLabels[condition];
  }
  return 'Condición desconocida';
};

export const TemperatureConditionOptions = Object.entries(TemperatureConditionLabels).map(([key, label]) => ({
  value: key as TemperatureCondition,
  label,
}));

export const isValidTemperatureCondition = (value: string): value is TemperatureCondition => {
  return Object.values(TemperatureCondition).includes(value as TemperatureCondition);
};
