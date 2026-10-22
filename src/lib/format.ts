export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  if (cents % 100 === 0) return `$${dollars.toFixed(0)}`;
  return `$${dollars.toFixed(2)}`;
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 6000;
export const STANDARD_SHIPPING_CENTS = 595;
export const EXPRESS_SHIPPING_CENTS = 1250;
