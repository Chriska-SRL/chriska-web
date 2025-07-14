export const formatPrice = (price: string) => {
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) return price;

  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};
