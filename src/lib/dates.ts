/**
 * Calendar-date helpers.
 *
 * Everything here works on `YYYY-MM-DD` strings rather than `Date` objects.
 *
 * Why: a habit is completed on a *calendar day* in the user's own timezone, not
 * at an instant in time. Doing streak math with `Date` and millisecond offsets
 * silently breaks across daylight-saving boundaries — adding 86,400,000ms to a
 * date lands on the same day twice in the fall and skips a day in the spring.
 * Comparing plain date strings sidesteps that entirely.
 */

/** A calendar date in `YYYY-MM-DD` form. */
export type DateKey = string;

const pad = (n: number): string => String(n).padStart(2, '0');

/** Converts a Date to a DateKey using its *local* calendar day. */
export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses a DateKey into a Date at local midnight. */
export function fromDateKey(key: DateKey): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Today's calendar date, in local time. */
export function today(now: Date = new Date()): DateKey {
  return toDateKey(now);
}

/**
 * Shifts a DateKey by a number of days.
 *
 * Uses the Date constructor's month/day overflow behaviour, which correctly
 * rolls over month and year boundaries (including leap years).
 */
export function addDays(key: DateKey, days: number): DateKey {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** Whole days from `a` to `b`. Negative when `b` is earlier than `a`. */
export function daysBetween(a: DateKey, b: DateKey): number {
  const MS_PER_DAY = 86_400_000;
  // Both are local midnight, so the difference is a whole number of days
  // except across a DST shift, where it is off by an hour. Rounding fixes it.
  return Math.round((fromDateKey(b).getTime() - fromDateKey(a).getTime()) / MS_PER_DAY);
}

/** Every date from `start` to `end`, inclusive. */
export function dateRange(start: DateKey, end: DateKey): DateKey[] {
  const out: DateKey[] = [];
  for (let d = start; daysBetween(d, end) >= 0; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Formats a DateKey for display, e.g. "Aug 18". */
export function formatShort(key: DateKey): string {
  return fromDateKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
