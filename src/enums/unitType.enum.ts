// @/enums/unitType.enum.ts
export enum UnitType {
  KILO = 'Kilo',
  UNIT = 'Unit',
}

// Mapeo para mostrar en español
export const UnitTypeLabels: Record<UnitType, string> = {
  [UnitType.KILO]: 'Kilos',
  [UnitType.UNIT]: 'Unidades',
};

// Función helper para obtener el label
export const getUnitTypeLabel = (type: UnitType | string): string => {
  if (!type || type === '') return 'Sin tipo';
  if (isValidUnitType(type)) {
    return UnitTypeLabels[type];
  }
  return 'Tipo desconocido';
};

// Array de opciones para selects
export const UnitTypeOptions = Object.entries(UnitTypeLabels).map(([key, label]) => ({
  value: key as UnitType,
  label,
}));

// Validador de tipo
export const isValidUnitType = (value: string): value is UnitType => {
  return Object.values(UnitType).includes(value as UnitType);
};
