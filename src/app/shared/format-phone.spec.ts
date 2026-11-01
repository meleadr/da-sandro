import { formatPhone } from './format-phone';

describe('formatPhone', () => {
  it('groups a Belgian mobile number', () => {
    expect(formatPhone('+32475291467')).toBe('+32 475 29 14 67');
  });

  it('leaves any other format unchanged', () => {
    expect(formatPhone('+3243211234')).toBe('+3243211234');
  });
});
