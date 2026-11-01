/** Formats a Belgian mobile number for display: +32475291467 becomes +32 475 29 14 67. */
export function formatPhone(phone: string): string {
  return phone.replace(/^\+32(\d{3})(\d{2})(\d{2})(\d{2})$/, '+32 $1 $2 $3 $4');
}
