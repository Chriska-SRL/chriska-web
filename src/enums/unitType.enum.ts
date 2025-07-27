export enum UnitType {
  KILO = 'Kilo',
  UNIT = 'Unit',
}

export const UnitTypeLabels: Record<UnitType, string> = {
  [UnitType.KILO]: 'Kilos',
  [UnitType.UNIT]: 'Unidades',
};

export const getUnitTypeLabel = (type: UnitType | string): string => {
  if (!type || type === '') return 'Sin tipo';
  if (isValidUnitType(type)) {
    return UnitTypeLabels[type];
  }
  return 'Tipo desconocido';
};

export const UnitTypeOptions = Object.entries(UnitTypeLabels).map(([key, label]) => ({
  value: key as UnitType,
  label,
}));

export const isValidUnitType = (value: string): value is UnitType => {
  return Object.values(UnitType).includes(value as UnitType);
};
