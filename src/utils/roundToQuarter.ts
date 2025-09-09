/**
 * Rounds a number to the nearest 0.25
 * Examples:
 * - 1.20 → 1.25
 * - 2.05 → 2.00
 * - 1.12 → 1.00
 * - 1.13 → 1.25
 * - 1.37 → 1.25
 * - 1.38 → 1.50
 */
export const roundToQuarter = (value: number): number => {
  return Math.round(value * 4) / 4;
};

/**
 * Validates if a number is a valid quarter value (multiple of 0.25)
 */
export const isValidQuarter = (value: number): boolean => {
  return value % 0.25 === 0;
};
