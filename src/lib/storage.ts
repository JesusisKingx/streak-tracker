import type { Habit } from './types';

const STORAGE_KEY = 'streak-tracker:habits:v1';

/**
 * Reads habits from localStorage.
 *
 * Returns an empty list rather than throwing if the stored value is missing or
 * malformed — a corrupted key should cost the user their history, not the whole
 * app. Storage access itself can also throw in private browsing modes.
 */
export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Habit[]) : [];
  } catch {
    return [];
  }
}

/** Persists habits, ignoring quota and permission errors. */
export function saveHabits(habits: readonly Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // Nothing useful to do here — the UI stays correct in memory either way.
  }
}
