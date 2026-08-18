import { useCallback, useEffect, useState } from 'react';
import { loadHabits, saveHabits } from './storage';
import { toggleCompletion } from './streaks';
import { today, type DateKey } from './dates';
import type { Habit } from './types';

const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'];

/** Owns the habit list and keeps it in sync with localStorage. */
export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        color: PALETTE[current.length % PALETTE.length],
        createdOn: today(),
        completions: [],
      },
    ]);
  }, []);

  const toggleDay = useCallback((id: string, date: DateKey) => {
    setHabits((current) =>
      current.map((habit) => (habit.id === id ? toggleCompletion(habit, date) : habit)),
    );
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }, []);

  return { habits, addHabit, toggleDay, removeHabit };
}
