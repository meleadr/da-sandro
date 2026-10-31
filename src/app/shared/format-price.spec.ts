import { formatPrice } from './format-price';

const normalize = (value: string) => value.replace(/\s/g, ' ');

describe('formatPrice', () => {
  it('omits decimals on whole euros', () => {
    expect(normalize(formatPrice(800))).toBe('8 €');
  });

  it('keeps cents when there are some', () => {
    expect(normalize(formatPrice(850))).toBe('8,50 €');
  });

  it('shows a placeholder for an unknown price', () => {
    expect(formatPrice(null)).toBe('—,— €');
  });
});
