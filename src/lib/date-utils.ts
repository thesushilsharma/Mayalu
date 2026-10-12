/**
 * Utility functions for robust Date and ISO formatting.
 * Designed to handle JavaScript Date objects, ISO strings,
 * PostgreSQL DATE return values, and legacy corrupted date strings.
 */

const MONTH_MAP: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

/**
 * Safely normalizes any date representation (Date instance, ISO string,
 * locale date string like "Sat Apr 10 1999 00:00:00 GM...", etc.)
 * into a strict HTML5 / PostgreSQL compatible "YYYY-MM-DD" string.
 * Returns empty string if the date cannot be parsed.
 */
export function formatBirthdateToISO(val: unknown): string {
  if (!val) return "";

  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) return "";
    // If UTC midnight (hours === 0 && minutes === 0 && seconds === 0 in UTC), use UTC slice
    if (
      val.getUTCHours() === 0 &&
      val.getUTCMinutes() === 0 &&
      val.getUTCSeconds() === 0
    ) {
      return val.toISOString().slice(0, 10);
    }
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const str = String(val).trim();
  if (!str) return "";

  // 1. Direct match for standard YYYY-MM-DD or ISO timestamp starting with YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // 2. Handle patterns like "Sat Apr 10 1999 00:00:00 GM" or "Apr 10 1999"
  const mdyMatch = str.match(/([a-zA-Z]{3})\s+(\d{1,2})\s+(\d{4})/i);
  if (mdyMatch) {
    const month = MONTH_MAP[mdyMatch[1].toLowerCase()];
    if (month) {
      const day = mdyMatch[2].padStart(2, "0");
      const year = mdyMatch[3];
      return `${year}-${month}-${day}`;
    }
  }

  // 3. Fallback to standard Date parsing
  const parsed = new Date(str);
  if (!Number.isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return "";
}

/**
 * Calculates accurate age from a birthdate string (YYYY-MM-DD) or Date object.
 */
export function calculateAgeFromBirthdate(val: unknown): number {
  const iso = formatBirthdateToISO(val);
  if (!iso) return 24;

  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return 24;

  const birth = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return age > 0 ? age : 24;
}
