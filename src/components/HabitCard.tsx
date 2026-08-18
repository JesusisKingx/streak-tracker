import { statsFor } from '../lib/streaks';
import type { DateKey } from '../lib/dates';
import type { Habit } from '../lib/types';
import { MonthCalendar } from './MonthCalendar';

interface HabitCardProps {
  habit: Habit;
  currentDay: DateKey;
  onToggle: (id: string, date: DateKey) => void;
  onRemove: (id: string) => void;
}

export function HabitCard({ habit, currentDay, onToggle, onRemove }: HabitCardProps) {
  const stats = statsFor(habit, currentDay);
  const doneToday = habit.completions.includes(currentDay);
  const rate = Math.round(stats.completionRate * 100);

  return (
    <article className="card">
      <header className="card__header">
        <span className="card__dot" style={{ backgroundColor: habit.color }} aria-hidden="true" />
        <h2 className="card__title">{habit.name}</h2>
        <button
          type="button"
          className="card__remove"
          onClick={() => onRemove(habit.id)}
          aria-label={`Delete ${habit.name}`}
        >
          &times;
        </button>
      </header>

      <button
        type="button"
        className={`check ${doneToday ? 'check--done' : ''}`}
        style={doneToday ? { backgroundColor: habit.color, borderColor: habit.color } : undefined}
        aria-pressed={doneToday}
        onClick={() => onToggle(habit.id, currentDay)}
      >
        {doneToday ? 'Done today' : 'Mark done today'}
      </button>

      <dl className="stats">
        <div>
          <dt>Current streak</dt>
          <dd>
            {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
          </dd>
        </div>
        <div>
          <dt>Longest streak</dt>
          <dd>
            {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
          </dd>
        </div>
        <div>
          <dt>Consistency</dt>
          <dd>{rate}%</dd>
        </div>
      </dl>

      <MonthCalendar
        completions={habit.completions}
        color={habit.color}
        habitName={habit.name}
        currentDay={currentDay}
        onToggle={(date) => onToggle(habit.id, date)}
      />
    </article>
  );
}
