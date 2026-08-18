import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  addMonths,
  formatCalendarDate,
  formatMonthYear,
  monthGrid,
  startOfMonth,
  type DateKey,
} from '../lib/dates';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

interface MonthCalendarProps {
  completions: readonly DateKey[];
  color: string;
  habitName: string;
  currentDay: DateKey;
  onToggle: (date: DateKey) => void;
}

/** A compact, keyboard-accessible calendar for marking real local calendar days. */
export function MonthCalendar({
  completions,
  color,
  habitName,
  currentDay,
  onToggle,
}: MonthCalendarProps) {
  const currentMonth = startOfMonth(currentDay);
  const [viewMonth, setViewMonth] = useState<DateKey>(() => currentMonth);
  const previousCurrentMonth = useRef(currentMonth);

  useEffect(() => {
    const priorCurrentMonth = previousCurrentMonth.current;
    setViewMonth((month) =>
      month === priorCurrentMonth || month > currentMonth ? currentMonth : month,
    );
    previousCurrentMonth.current = currentMonth;
  }, [currentMonth]);

  const cells = monthGrid(viewMonth);
  const completedDays = new Set(completions);
  const isCurrentMonth = viewMonth === currentMonth;
  const monthLabel = formatMonthYear(viewMonth);
  const accentStyle = { '--calendar-accent': color } as CSSProperties;

  return (
    <section className="calendar" aria-label={`${monthLabel} calendar for ${habitName}`}>
      <nav className="calendar__nav" aria-label={`Choose month for ${habitName}`}>
        <button
          type="button"
          className="calendar__nav-button"
          aria-label={`Previous month, ${formatMonthYear(addMonths(viewMonth, -1))}`}
          onClick={() => setViewMonth((month) => addMonths(month, -1))}
        >
          &lsaquo;
        </button>

        <button
          type="button"
          className="calendar__month"
          aria-disabled={isCurrentMonth}
          aria-label={
            isCurrentMonth
              ? `Viewing ${monthLabel}`
              : `Return to current month, ${formatMonthYear(currentMonth)}`
          }
          onClick={() => {
            if (!isCurrentMonth) setViewMonth(currentMonth);
          }}
        >
          <span aria-live="polite">{monthLabel}</span>
          {isCurrentMonth ? null : <small>Back to today</small>}
        </button>

        <button
          type="button"
          className="calendar__nav-button"
          aria-label={
            isCurrentMonth
              ? 'Next month is not available yet'
              : `Next month, ${formatMonthYear(addMonths(viewMonth, 1))}`
          }
          aria-disabled={isCurrentMonth}
          onClick={() => {
            if (!isCurrentMonth) setViewMonth((month) => addMonths(month, 1));
          }}
        >
          &rsaquo;
        </button>
      </nav>

      <ol className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <li key={weekday}>{weekday}</li>
        ))}
      </ol>

      <ol className="calendar__grid" aria-label={`${monthLabel} dates for ${habitName}`}>
        {cells.map((date, index) => {
          if (date === null) {
            return <li key={`empty-${index}`} className="calendar__empty" aria-hidden="true" />;
          }

          const isDone = completedDays.has(date);
          const isToday = date === currentDay;
          const isFuture = date > currentDay;
          const state = isFuture ? 'not available yet' : isDone ? 'completed' : 'not completed';

          return (
            <li key={date}>
              <button
                type="button"
                className={`calendar__day ${isDone ? 'calendar__day--done' : ''} ${
                  isToday ? 'calendar__day--today' : ''
                }`}
                style={accentStyle}
                disabled={isFuture}
                aria-current={isToday ? 'date' : undefined}
                aria-pressed={isFuture ? undefined : isDone}
                aria-label={`${formatCalendarDate(date)}, ${state}`}
                onClick={() => onToggle(date)}
              >
                {Number(date.slice(-2))}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
