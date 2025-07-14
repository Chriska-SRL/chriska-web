export enum VehicleCostType {
  FUEL = 'Fuel',
  MAINTENANCE = 'Maintenance',
  INSURANCE = 'Insurance',
  TOLLS = 'Tolls',
  PARKING = 'Parking',
  OTHER = 'Other',
}

export const VehicleCostTypeLabels: Record<VehicleCostType, string> = {
  [VehicleCostType.FUEL]: 'Combustible',
  [VehicleCostType.MAINTENANCE]: 'Mantenimiento',
  [VehicleCostType.INSURANCE]: 'Seguro',
  [VehicleCostType.TOLLS]: 'Peajes',
  [VehicleCostType.PARKING]: 'Estacionamiento',
  [VehicleCostType.OTHER]: 'Otro',
};

export const getVehicleCostTypeLabel = (type: VehicleCostType | string): string => {
  if (!type || type === '') return 'Sin tipo';
  if (isValidVehicleCostType(type)) {
    return VehicleCostTypeLabels[type];
  }
  return 'Tipo desconocido';
};

export const VehicleCostTypeOptions = Object.entries(VehicleCostTypeLabels).map(([key, label]) => ({
  value: key as VehicleCostType,
  label,
}));

export const isValidVehicleCostType = (value: string): value is VehicleCostType => {
  return Object.values(VehicleCostType).includes(value as VehicleCostType);
};
