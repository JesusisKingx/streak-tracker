import { AddHabitForm } from './components/AddHabitForm';
import { HabitCard } from './components/HabitCard';
import { useHabits } from './lib/useHabits';

export default function App() {
  const { habits, addHabit, toggleDay, removeHabit } = useHabits();

  return (
    <div className="app">
      <header className="app__header">
        <h1>Streak Tracker</h1>
        <p className="app__tagline">Build habits one day at a time.</p>
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
          <a href="https://ktforge.dev">DeVante Bush</a>.
        </p>
      </footer>
    </div>
  );
}
