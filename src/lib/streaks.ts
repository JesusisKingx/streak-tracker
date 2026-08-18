import { addDays, daysBetween, today, type DateKey } from './dates';
import type { Habit, HabitStats } from './types';

/**
 * Removes duplicates and sorts ascending.
 *
 * Callers can append completions freely without worrying about order or
 * double-taps; normalisation happens here, once, at the boundary.
 */
export function normalize(completions: readonly DateKey[]): DateKey[] {
  return [...new Set(completions)].sort();
}

/**
 * Length of the streak that is still alive as of `asOf`.
 *
 * A streak stays alive if the habit was completed today *or* yesterday. Ending
 * it at midnight would mean a user who hasn't logged today yet sees their streak
 * already at zero, which reads as a punishment for the day not being over. The
 * grace day is a deliberate product decision, not an off-by-one.
 */
export function currentStreak(completions: readonly DateKey[], asOf: DateKey = today()): number {
  const days = new Set(normalize(completions));
  if (days.size === 0) return 0;

  const anchor = days.has(asOf) ? asOf : days.has(addDays(asOf, -1)) ? addDays(asOf, -1) : null;
  if (anchor === null) return 0;

  let streak = 0;
  for (let day = anchor; days.has(day); day = addDays(day, -1)) streak++;
  return streak;
}

/** Longest run of consecutive days ever recorded. */
export function longestStreak(completions: readonly DateKey[]): number {
  const days = normalize(completions);
  if (days.length === 0) return 0;

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = daysBetween(days[i - 1], days[i]) === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }
  return longest;
}

/** Every stat for a habit, computed from its completion history. */
export function statsFor(habit: Habit, asOf: DateKey = today()): HabitStats {
  const days = normalize(habit.completions);
  // +1 because a habit created today has been active for one day, not zero.
  const daysActive = Math.max(1, daysBetween(habit.createdOn, asOf) + 1);

  return {
    currentStreak: currentStreak(days, asOf),
    longestStreak: longestStreak(days),
    totalCompletions: days.length,
    completionRate: days.length / daysActive,
  };
}

/** Adds or removes a completion for `date`, returning a new Habit. */
export function toggleCompletion(habit: Habit, date: DateKey): Habit {
  const days = new Set(habit.completions);
  if (days.has(date)) days.delete(date);
  else days.add(date);
  return { ...habit, completions: normalize([...days]) };
}
