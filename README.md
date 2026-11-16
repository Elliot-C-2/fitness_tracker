# GRIND — Arcade Edition

A retro arcade-styled home workout tracker. Mon/Wed/Fri schedule, alternating Day A (push/core/neck) and Day B (pull/legs/core), a 7-stage progressive program, then an endless maintenance phase.

## Run it

Open `index.html` in a browser. No build step or server needed.

On iPhone: host it somewhere, open in Safari → Share → Add to Home Screen.

## Structure

```
grind-arcade/
├── index.html        Page markup (home, workout, history, config pages + nav)
├── css/
│   └── styles.css    Arcade theme (CRT scanlines, pixel cards, colours)
├── js/
│   ├── data.js       Workout program: stages 1–7 + maintenance exercises
│   └── app.js        State, schedule, rendering and navigation
└── original/
    └── grind-arcade.html   The original single-file version
```

## Editing the program

Change exercises, reps or tips in `js/data.js`. Progress is saved in the browser's `localStorage` under the key `grind_arcade_v1`.
