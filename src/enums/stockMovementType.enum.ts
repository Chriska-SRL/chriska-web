export enum StockMovementType {
  INBOUND = 'Inbound',
  OUTBOUND = 'Outbound',
}

export const StockMovementTypeLabels: Record<StockMovementType, string> = {
  [StockMovementType.INBOUND]: 'Ingreso',
  [StockMovementType.OUTBOUND]: 'Egreso',
};

export const getStockMovementTypeLabel = (type: StockMovementType | string): string => {
  if (!type || type === '') return 'Sin tipo';
  if (isValidStockMovementType(type)) {
    return StockMovementTypeLabels[type];
  }
  return 'Tipo desconocido';
};

export const StockMovementTypeOptions = Object.entries(StockMovementTypeLabels).map(([key, label]) => ({
  value: key as StockMovementType,
  label,
}));

export const isValidStockMovementType = (value: string): value is StockMovementType => {
  return Object.values(StockMovementType).includes(value as StockMovementType);
};
