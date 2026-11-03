import type { Place } from '../../data/types';

export function fullAddress(place: Place): string | null {
  return place.address ? `${place.address}, ${place.postalCode} ${place.city}` : null;
}

/** Google Maps directions to the stop, or null until its exact address is known. */
export function directionsUrl(place: Place): string | null {
  const address = fullAddress(place);
  return address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : null;
}

/** Falls back on the town until the exact address of the stop is known. */
export function mapQuery(place: Place): string {
  return fullAddress(place) ?? `${place.postalCode} ${place.city}, Belgique`;
}
