export function formatUsPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function isValidUsPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 10) return false;
  const areaCode = digits.charCodeAt(0) - 48;
  const exchange = digits.charCodeAt(3) - 48;
  return areaCode >= 2 && areaCode <= 9 && exchange >= 2 && exchange <= 9;
}
