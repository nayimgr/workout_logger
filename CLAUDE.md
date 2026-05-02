# Workout Logger — Claude Context

## What this app is
A personal workout tracker. Lets me log sets/reps/weight against a defined
weekly plan, view session history, see progression charts, and export/import
all data as JSON. Single user, runs entirely client-side, installable as a PWA.

## Stack
- **Framework:** React 19, plain JavaScript (JSX). No TypeScript.
- **Build tool:** Vite 7 + `@vitejs/plugin-react` + `vite-plugin-pwa`
  (autoUpdate registerType, manifest, service worker — designed for mobile install).
- **Storage:** `localStorage` only. Four keys:
  - `wl_plan` — the program (days/exercises)
  - `wl_day_index` — which day comes next
  - `wl_sessions` — all logged sessions
  - `wl_notes` — freeform markdown
- **No backend.** No tests. ESLint only (no Prettier).

## Commands
- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview built output
- `npm run lint` — ESLint

## Deployment
- **Public repo**, deployed to **GitHub Pages** via `.github/workflows/deploy.yml`.
- **Vite base path:** `/workout_logger/` — keep this in mind for any path/asset changes.
- **Branch strategy:** commit straight to `main`. Every push to `main` deploys.
  - Implication: don't push half-finished features to main. If a change is risky
    or multi-step, do it locally first, verify, then push.

## Repo layout
```
src/
  main.jsx, App.jsx, index.css, App.module.css
  hooks/      useStorage.js, useWorkoutPlan.js, useSessions.js
  utils/      ids.js, chartData.js
  components/ TabBar, DayEditor, ExerciseEditor, ExerciseLogger, SetRow,
              ExerciseChart (+ .module.css each)
  views/      HomeView, PlanEditorView, HistoryView, ProgressView, NotesView
  assets/     (empty)
public/icons/ icon-192.png, icon-512.png
.github/workflows/deploy.yml
index.html, vite.config.js, eslint.config.js, package.json
```

## State flow
- `App.jsx` instantiates `useWorkoutPlan()` and `useSessions()` once and passes
  `planApi` / `sessionApi` down to each view as props.
- **No Context, no Redux.** Prop drilling is intentional — keep it that way
  unless complexity genuinely demands otherwise.
- `useStorage(key, initial)` is the localStorage-backed `useState` primitive
  underneath both hooks.

## Data model
The export format is the source of truth (see ProgressView export). Schemas:

```js
Plan            = { days: Day[] }
Day             = { id, name, exercises: Exercise[] }
Exercise        = { id, name, targetSets, targetReps, targetWeight }   // weight in kg
Session         = { id, date (ISO), dayId, exercises: SessionExercise[] }
SessionExercise = { exerciseId, sets: Set[] }
Set             = { reps, weight, rir }   // all stored as strings from inputs; rir optional (0–5, '' = not recorded)
```

**Backward compatibility is critical.** Old exports must still import cleanly.
When evolving the schema, default missing fields rather than rejecting the import.

## Known issues / quirks
- **`reps` and `weight` are strings**, because they come straight from input
  values. Don't "fix" this without an explicit migration — it'll break old exports.
- **Empty sessions get saved** — if I open Day B and never log a set, the
  session still saves with all-empty `sets` arrays. Need to distinguish:
  - "skipped on purpose"
  - "did but didn't log"
  - "session aborted / never started"
- **Step-up weight bug** — early entries have `weight: "1"` as a placeholder.
  The input UX likely defaults to 1 instead of empty when bodyweight or no load.
- **`removeDay` off-by-one** — computes `newLen` from stale `plan.days.length`
  outside the setter. Fix when touching that file.
- **"Finish Workout"** advances `currentDayIndex` by looping `advanceDay()`
  repeatedly. Functional but awkward. Worth simplifying if touched.
- **NotesView uses `marked` + `dangerouslySetInnerHTML`** — fine for
  single-user local; flag if notes ever become shared/cloud.
- **Progress charts share a global time X axis.** `buildVolumeSeriesByExercise`
  returns `{ seriesByExercise, xDomain }`; each chart sets `XAxis type="number"`
  + `scale="time"` + `domain={xDomain}` so all charts span the same date range.
  Per-exercise series contains **only** days that exercise was actually worked
  (no null fillers) — fillers would either reintroduce the dip-to-zero or break
  line-connecting between dots.

## Coaching context (why these features matter)
This app feeds a separate "gym buddy" coaching workflow where the JSON export
is reviewed periodically. Features are prioritized by how much they improve
the *signal quality* of that data, not just app polish.

## Feature priorities (high → low)

1. **Per-set and per-session notes** — short freeform text. "Felt easy,"
   "elbow tweak," "PR." Searchable in history view.

2. **Bodyweight log** — separate data series (date + weight), independent of
   sessions. Add a 5th localStorage key `wl_bodyweight`. Critical for
   relative-strength exercises and progress tracking.

3. **Skipped vs unlogged distinction** — explicit "skip" action on an exercise
   vs leaving sets empty vs aborting a session. Reflected in export.

4. **Coach-friendly export view** — alongside the raw JSON, a flat one-row-per-set
   view with: date, dayName, exerciseName (resolved, not just id), set#, reps,
   weight, RIR, note. CSV or a second JSON key. Much easier to reason about.

5. **Cardio session type** — eventually. Once cardio is added to the program,
   need a session type that logs duration, modality, and intensity (HR zone or
   RPE) instead of sets/reps/weight.

### Done
- **RPE / RIR per set** — optional 0–5 RIR field on each set, shown in the
  logger as a third numeric column and appended to History as `· RIR N`.
  Empty string = not recorded; old exports without `rir` still import.

## Coding style
- **Small, focused changes.** One feature per commit. The commit message should
  let me read the log later and know exactly what changed.
- **Don't refactor opportunistically.** If a refactor would help, propose it
  separately — don't fold it into a feature commit.
- **Backward-compatible data model.** See above. Old exports must import.
- **Match existing patterns.** CSS modules per component, hooks for state,
  prop drilling for data flow. Don't introduce Context, Redux, Zustand, etc.
  without a real reason.
- **Test by importing the existing example export** after any data-model change.
  There's a real export file used as the reference fixture.

## Working with me
- Ask clarifying questions before implementing if anything's ambiguous.
- For non-trivial changes, show me the plan before writing code.
- After changes, tell me what to test manually (since there are no automated tests).
- I commit and deploy myself — don't push to `main` on my behalf.
- I'm the only user. Don't suggest features for hypothetical other users
  (multi-account, sharing, social, etc.) unless I bring it up.

## What I don't want
- TypeScript migration (not now)
- Backend / cloud sync (not now — `localStorage` + JSON export is fine)
- Test suite (not until the app is stable enough that tests would pay off;
  current rate of change is too high)
- Major UI redesigns unless I ask
- New dependencies unless clearly justified