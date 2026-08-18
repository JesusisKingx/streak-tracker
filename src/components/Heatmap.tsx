import { addDays, formatShort, today, type DateKey } from '../lib/dates';

interface HeatmapProps {
  completions: readonly DateKey[];
  color: string;
  habitName: string;
  onToggle: (date: DateKey) => void;
  /** Number of days to show, ending today. */
  days?: number;
}

/**
 * A clickable strip of the last N days.
 *
 * Each cell is a real <button>, so the whole grid is keyboard-navigable and
 * screen readers announce both the date and whether it is done.
 */
export function Heatmap({ completions, color, habitName, onToggle, days = 28 }: HeatmapProps) {
  const end = today();
  const cells = Array.from({ length: days }, (_, i) => addDays(end, -(days - 1 - i)));
  const done = new Set(completions);

  return (
    <ul className="heatmap" aria-label={`Last ${days} days of ${habitName}`}>
      {cells.map((date) => {
        const isDone = done.has(date);
        return (
          <li key={date}>
            <button
              type="button"
              className="heatmap__cell"
              style={isDone ? { backgroundColor: color, borderColor: color } : undefined}
              aria-pressed={isDone}
              aria-label={`${formatShort(date)} — ${isDone ? 'completed' : 'not completed'}`}
              onClick={() => onToggle(date)}
            />
          </li>
        );
      })}
    </ul>
  );
}
