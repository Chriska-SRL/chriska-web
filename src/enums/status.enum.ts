export enum Status {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Canceled',
}

export const StatusLabels: Record<Status, string> = {
  [Status.PENDING]: 'Pendiente',
  [Status.CONFIRMED]: 'Confirmado',
  [Status.CANCELLED]: 'Cancelado',
};

export const getStatusLabel = (status: Status | string): string => {
  if (!status || status === '') return 'Sin estado';
  if (isValidStatus(status)) {
    return StatusLabels[status];
  }
  return 'Estado desconocido';
};

export const StatusOptions = Object.entries(StatusLabels).map(([key, label]) => ({
  value: key as Status,
  label,
}));

export const isValidStatus = (value: string): value is Status => {
  return Object.values(Status).includes(value as Status);
};

export const getStatusColor = (status: Status | string): string => {
  switch (status?.toLowerCase()) {
    case Status.PENDING.toLowerCase():
      return 'yellow';
    case Status.CONFIRMED.toLowerCase():
      return 'green';
    case Status.CANCELLED.toLowerCase():
      return 'red';
    default:
      return 'gray';
  }
};
