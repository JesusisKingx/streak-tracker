# Streak Tracker

A habit tracker built with React and TypeScript. Add habits, mark them done, and watch your streaks build up.

This is the web version of an idea I originally shipped as an iOS app — [Habit Tracker: Pro](https://apps.apple.com/app/id6747647440), on the App Store since July 2025. I rebuilt the core of it here to work through React and TypeScript properly.

**[Live demo](https://streak-tracker-devante.netlify.app)** · No account, no backend. Everything is stored in your browser.

---

## Features

- Add habits and mark them complete for today
- Current streak, longest streak, and consistency percentage per habit
- A clickable 28-day heatmap — fill in a day you forgot to log
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
│   ├── streaks.test.ts 29 unit tests
│   ├── storage.ts      localStorage read/write
│   ├── types.ts        Habit, HabitStats
│   └── useHabits.ts    state + persistence hook
├── components/
│   ├── AddHabitForm.tsx
│   ├── HabitCard.tsx
│   └── Heatmap.tsx
└── App.tsx
```

The streak logic lives in `src/lib/` as plain functions with no React imports. That separation is deliberate: the interesting logic is the part most likely to be wrong, and keeping it free of components means it can be tested directly, without rendering anything or mocking a DOM.

### Two decisions worth explaining

**Dates are strings, not `Date` objects.**

A habit is completed on a *calendar day* in the user's own timezone, not at an instant in time. The obvious implementation — add `86_400_000` milliseconds to step back a day — breaks twice a year: in the autumn a day is 25 hours long, so you land on the same date twice, and in the spring you skip one. Anyone whose streak spans a daylight-saving boundary sees it silently reset.

So every date in this codebase is a `YYYY-MM-DD` string, and stepping between days goes through the `Date` constructor's month-overflow behaviour rather than millisecond arithmetic. Comparing days becomes plain string comparison, which is also what makes the sort in `normalize()` work with no comparator. There are tests covering month boundaries, year boundaries, and February 29th in a leap year.

**A streak survives today not being logged yet.**

`currentStreak` anchors on today *or* yesterday. If it only counted today, then at 12:01am every user would open the app to a streak of zero — punished for a day that has barely started. The grace day is a product decision, and it is called out in a comment and pinned by a test so nobody later "fixes" it as an off-by-one.

---

## Tests

29 unit tests covering the streak and date logic:

```
✓ src/lib/streaks.test.ts (29 tests)

Test Files  1 passed (1)
     Tests  29 passed (29)
```

They cover the ordinary cases and the ones that actually bite — duplicate entries, unsorted input, gaps between runs, a longest streak that isn't the most recent one, month and year rollovers, leap years, and a habit created today (which would divide by zero and report `Infinity` consistency without the guard in `statsFor`).

---

## Built with

React 18 · TypeScript (strict) · Vite · Vitest · CSS custom properties

No UI framework and no state library. At this size both would be more configuration than code.

---

## About me

I'm DeVante Bush, a self-taught developer in Ohio. I build and ship products end to end through my studio, [KT Forge](https://ktforge.dev) — two iOS apps on the App Store, a web app, and a commercial After Effects extension.

[ktforge.dev](https://ktforge.dev) · [LinkedIn](https://linkedin.com/in/devante-bush) · [@JesusisKingx](https://github.com/JesusisKingx)

## License

MIT

---

## Deploying

This repo includes a `netlify.toml`, so connecting it in Netlify needs no manual
configuration — build command, publish directory, and SPA redirect are already set.
