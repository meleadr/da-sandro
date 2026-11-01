import { isSameOrigin } from './form-submission';

function request(origin?: string): Request {
  return new Request('https://da-sandro.be/api/contact', {
    method: 'POST',
    headers: origin ? { Origin: origin } : {},
  });
}

describe('isSameOrigin', () => {
  it('accepts a request from the site itself', () => {
    expect(isSameOrigin(request('https://da-sandro.be'))).toBe(true);
  });

  it('refuses a request from another site', () => {
    expect(isSameOrigin(request('https://evil.example'))).toBe(false);
  });

  it('refuses a request without an origin', () => {
    expect(isSameOrigin(request())).toBe(false);
  });

  it('refuses a malformed origin', () => {
    expect(isSameOrigin(request('nonsense'))).toBe(false);
  });
});
