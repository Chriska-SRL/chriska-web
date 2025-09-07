export enum StockMovementReasonType {
  PURCHASE = 'Purchase',
  SALE = 'Sale',
  RETURN = 'Return',
  ADJUSTMENT = 'Adjustment',
  DELIVERY_CANCELLATION = 'DeliveryCancellation',
}

export const StockMovementReasonTypeLabels: Record<StockMovementReasonType, string> = {
  [StockMovementReasonType.PURCHASE]: 'Compra',
  [StockMovementReasonType.SALE]: 'Venta',
  [StockMovementReasonType.RETURN]: 'Devolución',
  [StockMovementReasonType.ADJUSTMENT]: 'Ajuste',
  [StockMovementReasonType.DELIVERY_CANCELLATION]: 'Cancelación de entrega',
};

export const getStockMovementReasonTypeLabel = (type: StockMovementReasonType | string): string => {
  if (!type || type === '') return 'Sin tipo';
  if (isValidStockMovementReasonType(type)) {
    return StockMovementReasonTypeLabels[type];
  }
  return 'Tipo desconocido';
};

export const getStockMovementReasonTypeColor = (type: StockMovementReasonType | string): string => {
  switch (type) {
    case StockMovementReasonType.PURCHASE:
      return 'green';
    case StockMovementReasonType.SALE:
      return 'blue';
    case StockMovementReasonType.RETURN:
      return 'orange';
    case StockMovementReasonType.ADJUSTMENT:
      return 'purple';
    case StockMovementReasonType.DELIVERY_CANCELLATION:
      return 'red';
    default:
      return 'gray';
  }
};

export const StockMovementReasonTypeOptions = Object.entries(StockMovementReasonTypeLabels).map(([key, label]) => ({
  value: key as StockMovementReasonType,
  label,
}));

export const isValidStockMovementReasonType = (value: string): value is StockMovementReasonType => {
  return Object.values(StockMovementReasonType).includes(value as StockMovementReasonType);
};
