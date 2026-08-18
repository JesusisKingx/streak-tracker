/**
 * Calendar-date helpers.
 *
 * Everything here works on `YYYY-MM-DD` strings rather than `Date` objects.
 *
 * Why: a habit is completed on a *calendar day* in the user's own timezone, not
 * at an instant in time. Doing streak math with `Date` and millisecond offsets
 * silently breaks across daylight saving boundaries. Adding 86,400,000ms to a
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

/** First calendar day of the month containing `key`. */
export function startOfMonth(key: DateKey): DateKey {
  const date = fromDateKey(key);
  return toDateKey(new Date(date.getFullYear(), date.getMonth(), 1));
}

/** First calendar day a number of months before or after the month containing `key`. */
export function addMonths(key: DateKey, months: number): DateKey {
  const date = fromDateKey(key);
  return toDateKey(new Date(date.getFullYear(), date.getMonth() + months, 1));
}

/** Six calendar weeks, padded so every month begins on Sunday and keeps a stable height. */
export function monthGrid(key: DateKey): Array<DateKey | null> {
  const first = fromDateKey(startOfMonth(key));
  const year = first.getFullYear();
  const month = first.getMonth();
  const leadingCells = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = 42;

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - leadingCells + 1;
    return day >= 1 && day <= daysInMonth ? toDateKey(new Date(year, month, day)) : null;
  });
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

/** Formats a DateKey as a compact, complete calendar date, e.g. "Tue, Aug 18, 2026". */
export function formatCalendarDate(key: DateKey, locale?: string): string {
  return fromDateKey(key).toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Formats the month containing a DateKey, e.g. "August 2026". */
export function formatMonthYear(key: DateKey, locale?: string): string {
  return fromDateKey(key).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}
