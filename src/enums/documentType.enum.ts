export enum DocumentType {
  CLIENT_PAYMENT = 'ClientPayment',
  PURCHASE = 'Purchase',
  SALE = 'Sale',
  SUPPLIER_PAYMENT = 'SupplierPayment',
  RETURN_SALE = 'ReturnSale',
  RETURN_PURCHASE = 'ReturnPurchase',
}

export const DocumentTypeLabels: Record<string, string> = {
  [DocumentType.CLIENT_PAYMENT]: 'Pago de cliente',
  [DocumentType.PURCHASE]: 'Compra',
  [DocumentType.SALE]: 'Venta',
  [DocumentType.SUPPLIER_PAYMENT]: 'Pago a proveedor',
  [DocumentType.RETURN_SALE]: 'Devolución de venta',
  [DocumentType.RETURN_PURCHASE]: 'Devolución de compra',
};

export const getDocumentTypeLabel = (type: string): string => {
  return DocumentTypeLabels[type] || type;
};

export const getDocumentTypeColor = (type: string): string => {
  switch (type) {
    case DocumentType.CLIENT_PAYMENT:
      return 'green';
    case DocumentType.PURCHASE:
      return 'red';
    case DocumentType.SALE:
      return 'blue';
    case DocumentType.SUPPLIER_PAYMENT:
      return 'orange';
    case DocumentType.RETURN_SALE:
      return 'purple';
    case DocumentType.RETURN_PURCHASE:
      return 'yellow';
    default:
      return 'gray';
  }
};
