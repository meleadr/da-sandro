import type { Place } from '../../data/types';

export function fullAddress(place: Place): string | null {
  return place.address ? `${place.address}, ${place.postalCode} ${place.city}` : null;
}

/** Falls back on the town until the exact address of the stop is known. */
export function mapQuery(place: Place): string {
  return fullAddress(place) ?? `${place.postalCode} ${place.city}, Belgique`;
}
