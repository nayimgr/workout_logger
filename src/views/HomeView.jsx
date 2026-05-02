import { useState } from 'react'
import { marked } from 'marked'
import ExerciseLogger from '../components/ExerciseLogger'
import styles from './HomeView.module.css'

function warmupHtml(text) {
  try {
    return marked.parse(text, { async: false })
  } catch {
    return ''
  }
}

function WarmupBlock({ text }) {
  const [open, setOpen] = useState(true)
  return (
    <details
      className={styles.warmup}
      open={open}
      onToggle={e => setOpen(e.currentTarget.open)}
    >
      <summary className={styles.warmupSummary}>Warmup &amp; prehab</summary>
      <div
        className={styles.warmupBody}
        dangerouslySetInnerHTML={{ __html: warmupHtml(text) }}
      />
    </details>
  )
}

export default function HomeView({ planApi, sessionApi }) {
  const { plan, currentDay, currentDayIndex, advanceDay } = planApi
  const { sessions, startSession, setSessionNote, logSet, addSet, removeSet } = sessionApi

  const today = new Date().toISOString().slice(0, 10)

  const [selectedDayId, setSelectedDayId] = useState(() => currentDay?.id ?? null)

  const selectedDay = plan.days.find(d => d.id === selectedDayId) ?? currentDay

  const [activeSessionId, setActiveSessionId] = useState(() => {
    if (!selectedDay) return null
    const existing = [...sessions].reverse().find(
      s => s.date.startsWith(today) && s.dayId === selectedDay.id
    )
    return existing?.id ?? null
  })

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? null

  function handleSelectDay(day) {
    setSelectedDayId(day.id)
    const existing = [...sessions].reverse().find(
      s => s.date.startsWith(today) && s.dayId === day.id
    )
    setActiveSessionId(existing?.id ?? null)
  }

  function handleStart() {
    const id = startSession(selectedDay.id, selectedDay.exercises)
    setActiveSessionId(id)
  }

  function handleFinish() {
    // advance to next day after the selected one
    const idx = plan.days.findIndex(d => d.id === selectedDay.id)
    if (idx !== -1) {
      const nextIdx = (idx + 1) % plan.days.length
      // update stored index by advancing from current until we reach nextIdx
      const steps = (nextIdx - currentDayIndex + plan.days.length) % plan.days.length
      for (let i = 0; i < steps; i++) advanceDay()
    }
    setActiveSessionId(null)
  }

  if (!selectedDay) {
    return (
      <div className={styles.empty}>
        <p>No workout days configured.</p>
        <p>Go to the <strong>Plan</strong> tab to add some days.</p>
      </div>
    )
  }

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <div className={styles.dayLabel}>Today</div>
        {!activeSession ? (
          <div className={styles.dayPicker}>
            {plan.days.map(d => (
              <button
                key={d.id}
                className={`${styles.dayPill} ${d.id === selectedDay.id ? styles.dayPillActive : ''}`}
                onClick={() => handleSelectDay(d)}
              >
                {d.name}
              </button>
            ))}
          </div>
        ) : (
          <>
            <h1 className={styles.dayName}>{selectedDay.name}</h1>
            <p className={styles.startedAt}>
              Started at{' '}
              {new Date(activeSession.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </>
        )}
      </header>

      {!activeSession ? (
        <button className={styles.startBtn} onClick={handleStart}>
          Start Workout
        </button>
      ) : (
        <>
          {selectedDay.warmup && (
            <WarmupBlock text={selectedDay.warmup} />
          )}
          <label className={styles.noteLabel}>
            Session note
            <textarea
              className={styles.noteField}
              value={activeSession.note ?? ''}
              onChange={e => setSessionNote(activeSessionId, e.target.value)}
              placeholder="energy / sleep / tib / anything off"
              rows={2}
            />
          </label>
          {selectedDay.exercises.map(exercise => {
            const sessionEx = activeSession.exercises.find(
              e => e.exerciseId === exercise.id
            )
            return (
              <ExerciseLogger
                key={exercise.id}
                exercise={exercise}
                sessionSets={sessionEx?.sets ?? []}
                onLogSet={(setIndex, reps, weight, rir) =>
                  logSet(activeSessionId, exercise.id, setIndex, reps, weight, rir)
                }
                onAddSet={() => addSet(activeSessionId, exercise.id)}
                onRemoveSet={setIndex =>
                  removeSet(activeSessionId, exercise.id, setIndex)
                }
              />
            )
          })}
          <button className={styles.finishBtn} onClick={handleFinish}>
            Finish Workout ✓
          </button>
        </>
      )}
    </div>
  )
}
