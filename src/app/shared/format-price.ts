const CENTS_PER_EURO = 100;

export function formatPrice(priceCents: number | null): string {
  if (priceCents === null) {
    return '—,— €';
  }
  const digits = priceCents % CENTS_PER_EURO === 0 ? 0 : 2;
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(priceCents / CENTS_PER_EURO);
}
