import { describe, it, expect } from 'vitest';
import { currentStreak, longestStreak, normalize, statsFor, toggleCompletion } from './streaks';
import { addDays, daysBetween, dateRange, toDateKey } from './dates';
import type { Habit } from './types';

const TODAY = '2026-08-18';
const days = (n: number) => addDays(TODAY, -n);

describe('normalize', () => {
  it('removes duplicates and sorts ascending', () => {
    expect(normalize(['2026-08-18', '2026-08-16', '2026-08-18'])).toEqual([
      '2026-08-16',
      '2026-08-18',
    ]);
  });

  it('returns an empty array for no completions', () => {
    expect(normalize([])).toEqual([]);
  });
});

describe('currentStreak', () => {
  it('is zero with no completions', () => {
    expect(currentStreak([], TODAY)).toBe(0);
  });

  it('counts a single completion today', () => {
    expect(currentStreak([TODAY], TODAY)).toBe(1);
  });

  it('counts consecutive days ending today', () => {
    expect(currentStreak([days(2), days(1), days(0)], TODAY)).toBe(3);
  });

  it('survives today not being logged yet', () => {
    // Yesterday is the anchor: the day is not over, so the streak is not broken.
    expect(currentStreak([days(2), days(1)], TODAY)).toBe(2);
  });

  it('breaks once two full days are missed', () => {
    expect(currentStreak([days(3), days(2)], TODAY)).toBe(0);
  });

  it('ignores older runs separated by a gap', () => {
    expect(currentStreak([days(9), days(8), days(7), days(1), days(0)], TODAY)).toBe(2);
  });

  it('is unaffected by duplicate entries', () => {
    expect(currentStreak([days(1), days(1), days(0), days(0)], TODAY)).toBe(2);
  });

  it('is unaffected by input order', () => {
    expect(currentStreak([days(0), days(2), days(1)], TODAY)).toBe(3);
  });

  it('counts a streak that crosses a month boundary', () => {
    expect(currentStreak(['2026-07-30', '2026-07-31', '2026-08-01'], '2026-08-01')).toBe(3);
  });

  it('counts a streak that crosses a year boundary', () => {
    expect(currentStreak(['2025-12-31', '2026-01-01'], '2026-01-01')).toBe(2);
  });

  it('counts a streak across Feb 29 in a leap year', () => {
    expect(currentStreak(['2028-02-28', '2028-02-29', '2028-03-01'], '2028-03-01')).toBe(3);
  });
});

describe('longestStreak', () => {
  it('is zero with no completions', () => {
    expect(longestStreak([])).toBe(0);
  });

  it('finds the longest of several runs', () => {
    const completions = ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-10', '2026-08-11'];
    expect(longestStreak(completions)).toBe(3);
  });

  it('finds a run that is not the most recent one', () => {
    const completions = ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-18'];
    expect(longestStreak(completions)).toBe(3);
  });

  it('is 1 when no two days are adjacent', () => {
    expect(longestStreak(['2026-08-01', '2026-08-05', '2026-08-09'])).toBe(1);
  });
});

describe('statsFor', () => {
  const habit = (overrides: Partial<Habit> = {}): Habit => ({
    id: 'h1',
    name: 'Read',
    color: '#6366f1',
    createdOn: days(9),
    completions: [],
    ...overrides,
  });

  it('reports a completion rate of 1 for a perfect record', () => {
    const completions = dateRange(days(9), days(0));
    expect(statsFor(habit({ completions }), TODAY).completionRate).toBe(1);
  });

  it('reports a completion rate of 0 for an untouched habit', () => {
    expect(statsFor(habit(), TODAY).completionRate).toBe(0);
  });

  it('counts a habit created today as one day active, not zero', () => {
    const h = habit({ createdOn: TODAY, completions: [TODAY] });
    // Guards against a divide-by-zero producing Infinity.
    expect(statsFor(h, TODAY).completionRate).toBe(1);
  });

  it('counts distinct days only', () => {
    const h = habit({ completions: [TODAY, TODAY, days(1)] });
    expect(statsFor(h, TODAY).totalCompletions).toBe(2);
  });
});

describe('toggleCompletion', () => {
  const base: Habit = {
    id: 'h1',
    name: 'Read',
    color: '#6366f1',
    createdOn: days(5),
    completions: [days(1)],
  };

  it('adds a date that is not present', () => {
    expect(toggleCompletion(base, TODAY).completions).toContain(TODAY);
  });

  it('removes a date that is present', () => {
    expect(toggleCompletion(base, days(1)).completions).not.toContain(days(1));
  });

  it('does not mutate the original habit', () => {
    const before = [...base.completions];
    toggleCompletion(base, TODAY);
    expect(base.completions).toEqual(before);
  });

  it('round-trips back to the original state', () => {
    const once = toggleCompletion(base, TODAY);
    expect(toggleCompletion(once, TODAY).completions).toEqual(base.completions);
  });
});

describe('date helpers', () => {
  it('round-trips a Date through toDateKey', () => {
    expect(toDateKey(new Date(2026, 7, 18))).toBe('2026-08-18');
  });

  it('measures a gap across a month boundary', () => {
    expect(daysBetween('2026-07-31', '2026-08-02')).toBe(2);
  });

  it('returns a negative gap when the end is earlier', () => {
    expect(daysBetween('2026-08-02', '2026-07-31')).toBe(-2);
  });

  it('builds an inclusive range', () => {
    expect(dateRange('2026-08-16', '2026-08-18')).toEqual([
      '2026-08-16',
      '2026-08-17',
      '2026-08-18',
    ]);
  });
});
