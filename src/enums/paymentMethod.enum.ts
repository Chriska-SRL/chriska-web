export enum PaymentMethod {
  CASH = 'Cash',
  CHEQUE = 'Cheque',
  DEBIT_CARD = 'DebitCard',
  BANK_TRANSFER = 'BankTransfer',
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CHEQUE]: 'Cheque',
  [PaymentMethod.DEBIT_CARD]: 'Tarjeta de débito',
  [PaymentMethod.BANK_TRANSFER]: 'Transferencia bancaria',
};

export const getPaymentMethodLabel = (paymentMethod: PaymentMethod | string): string => {
  if (!paymentMethod || paymentMethod === '') return 'Sin método';
  if (isValidPaymentMethod(paymentMethod)) {
    return PaymentMethodLabels[paymentMethod];
  }
  return 'Método desconocido';
};

export const PaymentMethodOptions = Object.entries(PaymentMethodLabels).map(([key, label]) => ({
  value: key as PaymentMethod,
  label,
}));

export const isValidPaymentMethod = (value: string): value is PaymentMethod => {
  return Object.values(PaymentMethod).includes(value as PaymentMethod);
};

export const getPaymentMethodColor = (paymentMethod: PaymentMethod | string): string => {
  switch (paymentMethod?.toLowerCase()) {
    case PaymentMethod.CASH.toLowerCase():
      return 'green';
    case PaymentMethod.CHEQUE.toLowerCase():
      return 'blue';
    case PaymentMethod.DEBIT_CARD.toLowerCase():
      return 'purple';
    case PaymentMethod.BANK_TRANSFER.toLowerCase():
      return 'teal';
    default:
      return 'gray';
  }
};
