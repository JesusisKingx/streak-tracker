import { useState, type FormEvent } from 'react';

interface AddHabitFormProps {
  onAdd: (name: string) => void;
}

export function AddHabitForm({ onAdd }: AddHabitFormProps) {
  const [name, setName] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onAdd(name);
    setName('');
  }

  return (
    <form className="add" onSubmit={handleSubmit}>
      <label className="add__label" htmlFor="habit-name">
        New habit
      </label>
      <div className="add__row">
        <input
          id="habit-name"
          className="add__input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Read for 20 minutes"
          autoComplete="off"
        />
        <button type="submit" className="add__button" disabled={!name.trim()}>
          Add
        </button>
      </div>
    </form>
  );
}
