import type { DateKey } from './dates';

export interface Habit {
  id: string;
  name: string;
  /** Hex colour used for the habit's chip and heatmap cells. */
  color: string;
  createdOn: DateKey;
  /** Calendar dates the habit was completed. Unordered; may contain duplicates. */
  completions: DateKey[];
}

export interface HabitStats {
  /** Length of the streak still running today. 0 if it has been broken. */
  currentStreak: number;
  /** Longest streak ever recorded for this habit. */
  longestStreak: number;
  /** Total number of distinct days completed. */
  totalCompletions: number;
  /** Share of days completed since the habit was created, 0 to 1. */
  completionRate: number;
}
