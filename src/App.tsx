import { AddHabitForm } from './components/AddHabitForm';
import { HabitCard } from './components/HabitCard';
import { formatCalendarDate } from './lib/dates';
import { useHabits } from './lib/useHabits';
import { useToday } from './lib/useToday';

export default function App() {
  const { habits, addHabit, toggleDay, removeHabit } = useHabits();
  const currentDay = useToday();

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Streak Tracker</h1>
          <p className="app__tagline">Build habits one day at a time.</p>
        </div>
        <time className="app__date" dateTime={currentDay}>
          <span className="app__date-label">Today</span>
          <span>{formatCalendarDate(currentDay)}</span>
        </time>
      </header>

      <main>
        <AddHabitForm onAdd={addHabit} />

        {habits.length === 0 ? (
          <p className="empty">No habits yet. Add one above to get started.</p>
        ) : (
          <div className="grid">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                currentDay={currentDay}
                onToggle={toggleDay}
                onRemove={removeHabit}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Your data stays in this browser. Built by{' '}
          <a href="https://ktforge.dev">KT Forge</a>.
        </p>
      </footer>
    </div>
  );
}
