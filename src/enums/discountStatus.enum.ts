export enum DiscountStatus {
  AVAILABLE = 'Available',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
}

export const DiscountStatusLabels: Record<DiscountStatus, string> = {
  [DiscountStatus.AVAILABLE]: 'Disponible',
  [DiscountStatus.CLOSED]: 'Cerrado',
  [DiscountStatus.CANCELLED]: 'Cancelado',
};

export const getDiscountStatusLabel = (status: DiscountStatus | string): string => {
  if (!status || status === '') return 'Sin estado';
  if (isValidDiscountStatus(status)) {
    return DiscountStatusLabels[status];
  }
  return 'Estado desconocido';
};

export const DiscountStatusOptions = Object.entries(DiscountStatusLabels).map(([key, label]) => ({
  value: key as DiscountStatus,
  label,
}));

export const isValidDiscountStatus = (value: string): value is DiscountStatus => {
  return Object.values(DiscountStatus).includes(value as DiscountStatus);
};
