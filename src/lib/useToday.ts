import { useEffect, useState } from 'react';
import { today, type DateKey } from './dates';

/** Keeps the app on the user's current local calendar day, including across midnight. */
export function useToday(): DateKey {
  const [currentDay, setCurrentDay] = useState<DateKey>(() => today());

  useEffect(() => {
    let midnightTimeoutId: number;

    const syncCurrentDay = () => {
      const nextDay = today();
      setCurrentDay((previousDay) => (previousDay === nextDay ? previousDay : nextDay));
    };

    const scheduleNextMidnight = () => {
      window.clearTimeout(midnightTimeoutId);
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const delay = Math.max(1_000, nextMidnight.getTime() - now.getTime() + 100);

      midnightTimeoutId = window.setTimeout(() => {
        syncCurrentDay();
        scheduleNextMidnight();
      }, delay);
    };

    const syncAndReschedule = () => {
      syncCurrentDay();
      scheduleNextMidnight();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) syncAndReschedule();
    };

    scheduleNextMidnight();
    window.addEventListener('focus', syncAndReschedule);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(midnightTimeoutId);
      window.removeEventListener('focus', syncAndReschedule);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return currentDay;
}
