import { useState } from 'react'
import ExerciseLogger from '../components/ExerciseLogger'
import styles from './HomeView.module.css'

export default function HomeView({ planApi, sessionApi }) {
  const { currentDay, advanceDay } = planApi
  const { sessions, startSession, logSet, addSet, removeSet } = sessionApi

  const today = new Date().toISOString().slice(0, 10)

  const [activeSessionId, setActiveSessionId] = useState(() => {
    if (!currentDay) return null
    const existing = [...sessions].reverse().find(
      s => s.date.startsWith(today) && s.dayId === currentDay.id
    )
    return existing?.id ?? null
  })

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? null

  function handleStart() {
    const id = startSession(currentDay.id, currentDay.exercises)
    setActiveSessionId(id)
  }

  function handleFinish() {
    advanceDay()
    setActiveSessionId(null)
  }

  if (!currentDay) {
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
        <h1 className={styles.dayName}>{currentDay.name}</h1>
        {activeSession && (
          <p className={styles.startedAt}>
            Started at{' '}
            {new Date(activeSession.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </header>

      {!activeSession ? (
        <button className={styles.startBtn} onClick={handleStart}>
          Start Workout
        </button>
      ) : (
        <>
          {currentDay.exercises.map(exercise => {
            const sessionEx = activeSession.exercises.find(
              e => e.exerciseId === exercise.id
            )
            return (
              <ExerciseLogger
                key={exercise.id}
                exercise={exercise}
                sessionSets={sessionEx?.sets ?? []}
                onLogSet={(setIndex, reps, weight) =>
                  logSet(activeSessionId, exercise.id, setIndex, reps, weight)
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
