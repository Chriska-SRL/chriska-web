// export type VehicleCostType = 'Fuel' | 'Maintenance' | 'Insurance' | 'Tolls' | 'Parking' | 'Other';
export enum VehicleCostType {
  Fuel = 'Fuel',
  Maintenance = 'Maintenance',
  Insurance = 'Insurance',
  Tolls = 'Tolls',
  Parking = 'Parking',
  Other = 'Other',
}

export const VehicleCostTypeLabels: Record<VehicleCostType, string> = {
  [VehicleCostType.Fuel]: 'Combustible',
  [VehicleCostType.Maintenance]: 'Mantenimiento',
  [VehicleCostType.Insurance]: 'Seguro',
  [VehicleCostType.Tolls]: 'Peajes',
  [VehicleCostType.Parking]: 'Estacionamiento',
  [VehicleCostType.Other]: 'Otro',
};
