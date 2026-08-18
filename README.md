# Streak Tracker

A habit tracker built with React and TypeScript. Add a habit, mark it done each day, and the app keeps count of how long you have kept it going.

This is the web version of an app I shipped for iOS: [Habit Tracker: Pro](https://apps.apple.com/app/id6747647440), on the App Store since July 2025. I rebuilt the core of it here to work through React and TypeScript properly.

**[Live demo](https://streak-tracker-devante.netlify.app)** · No account, no backend. Everything stays in your browser.

---

## Features

- Add habits and mark them complete for today
- A navigable month calendar with real weekdays and dates
- Current streak, longest streak, and consistency percentage for each habit
- A header date that stays accurate across midnight
- Data persists in `localStorage` across reloads
- Keyboard accessible throughout, with light and dark themes

---

## Running it

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite
npm run build    # production build
npm run typecheck
```

Requires Node 18 or newer.

---

## How it's put together

```
src/
├── lib/
│   ├── dates.ts        calendar-date helpers
│   ├── streaks.ts      streak and stats calculation
│   ├── streaks.test.ts 38 unit tests
│   ├── storage.ts      localStorage read/write
│   ├── types.ts        Habit, HabitStats
│   ├── useHabits.ts    state and persistence hook
│   └── useToday.ts     local-day refresh hook
├── components/
│   ├── AddHabitForm.tsx
│   ├── HabitCard.tsx
│   └── MonthCalendar.tsx
└── App.tsx
```

The streak logic lives in `src/lib/` as plain functions with no React imports. That separation is deliberate: the interesting logic is the part most likely to be wrong, and keeping it out of the components means it can be tested directly, without rendering anything or mocking a DOM.

### Two decisions worth explaining

**Dates are strings, not `Date` objects.**

A habit is completed on a *calendar day* in the user's own timezone, not at an instant in time. The obvious implementation, adding 86,400,000 milliseconds to step back a day, breaks twice a year: in autumn a day runs 25 hours, so you land on the same date twice; in spring you skip one entirely. Anyone whose streak crosses a daylight saving boundary watches it silently reset.

So every date here is a `YYYY-MM-DD` string, and stepping between days goes through the `Date` constructor's month overflow behavior instead of millisecond arithmetic. Comparing two days becomes plain string comparison, which is also why the sort in `normalize()` needs no comparator. Tests cover month boundaries, year boundaries, and February 29 in a leap year.

**A streak survives today not being logged yet.**

`currentStreak` anchors on today or yesterday. If it counted only today, every user would open the app at 12:01 a.m. to a streak of zero, punished for a day that had barely started. The grace day is a product decision rather than an off-by-one, so it is called out in a comment and pinned by a test.

---

## Tests

38 unit tests covering the streak and date logic:

```
✓ src/lib/streaks.test.ts (38 tests)

Test Files  1 passed (1)
     Tests  38 passed (38)
```

They cover the ordinary cases and the ones that actually bite: duplicate entries, unsorted input, gaps between runs, a longest streak that is not the most recent one, month and year rollovers, leap years, future dates, and backfilled history that could otherwise push consistency above 100 percent.

---

## Built with

React 18 · TypeScript (strict) · Vite · Vitest · CSS custom properties

No UI framework and no state library. At this size, both would be more configuration than code.

---

## Deploying

`netlify.toml` is included, so connecting the repo in Netlify takes no manual setup. The build command, publish directory, Node version, and single-page redirect are already configured.

---

## About me

I'm DeVante Bush, a self-taught developer in Ohio. I build and ship products end to end through my studio, [KT Forge](https://ktforge.dev): two iOS apps on the App Store, a web app, and a commercial After Effects extension.

[ktforge.dev](https://ktforge.dev) · [LinkedIn](https://linkedin.com/in/devante-bush) · [@JesusisKingx](https://github.com/JesusisKingx)

## License

MIT
