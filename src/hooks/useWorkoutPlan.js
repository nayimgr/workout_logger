import { useStorage } from './useStorage'
import { makeId } from '../utils/ids'

const DEFAULT_PLAN = {
  days: [
    {
      id: 'day-a',
      name: 'Day A — Push',
      exercises: [
        { id: 'ex-1', name: 'Bench Press',     targetSets: 4, targetReps: 8,  targetWeight: 60 },
        { id: 'ex-2', name: 'Overhead Press',  targetSets: 3, targetReps: 10, targetWeight: 40 },
        { id: 'ex-3', name: 'Tricep Dips',     targetSets: 3, targetReps: 12, targetWeight: 0  },
      ],
    },
    {
      id: 'day-b',
      name: 'Day B — Pull',
      exercises: [
        { id: 'ex-4', name: 'Barbell Row', targetSets: 4, targetReps: 8,  targetWeight: 60 },
        { id: 'ex-5', name: 'Pull-Ups',    targetSets: 3, targetReps: 8,  targetWeight: 0  },
        { id: 'ex-6', name: 'Face Pulls',  targetSets: 3, targetReps: 15, targetWeight: 20 },
      ],
    },
    {
      id: 'day-c',
      name: 'Day C — Legs',
      exercises: [
        { id: 'ex-7', name: 'Squat',              targetSets: 4, targetReps: 6,  targetWeight: 80 },
        { id: 'ex-8', name: 'Romanian Deadlift',  targetSets: 3, targetReps: 10, targetWeight: 60 },
        { id: 'ex-9', name: 'Leg Press',          targetSets: 3, targetReps: 12, targetWeight: 100 },
      ],
    },
  ],
}

export function useWorkoutPlan() {
  const [plan, setPlan] = useStorage('wl_plan', DEFAULT_PLAN)
  const [currentDayIndex, setCurrentDayIndex] = useStorage('wl_day_index', 0)

  const currentDay =
    plan.days.length > 0 ? plan.days[currentDayIndex % plan.days.length] : null

  // --- Rotation ---
  function advanceDay() {
    setCurrentDayIndex(i => (i + 1) % plan.days.length)
  }

  // --- Day operations ---
  function addDay(name) {
    setPlan(p => ({
      ...p,
      days: [...p.days, { id: makeId(), name, exercises: [] }],
    }))
  }

  function removeDay(dayId) {
    setPlan(p => {
      const days = p.days.filter(d => d.id !== dayId)
      return { ...p, days }
    })
    setCurrentDayIndex(i => {
      const newLen = plan.days.length - 1
      return newLen <= 0 ? 0 : i % newLen
    })
  }

  function renameDay(dayId, name) {
    setPlan(p => ({
      ...p,
      days: p.days.map(d => (d.id === dayId ? { ...d, name } : d)),
    }))
  }

  function reorderDays(fromIndex, toIndex) {
    setPlan(p => {
      const days = [...p.days]
      const [moved] = days.splice(fromIndex, 1)
      days.splice(toIndex, 0, moved)
      return { ...p, days }
    })
  }

  // --- Exercise operations ---
  function addExercise(dayId, name) {
    const ex = { id: makeId(), name, targetSets: 3, targetReps: 10, targetWeight: 0 }
    setPlan(p => ({
      ...p,
      days: p.days.map(d =>
        d.id === dayId ? { ...d, exercises: [...d.exercises, ex] } : d
      ),
    }))
  }

  function removeExercise(dayId, exerciseId) {
    setPlan(p => ({
      ...p,
      days: p.days.map(d =>
        d.id === dayId
          ? { ...d, exercises: d.exercises.filter(e => e.id !== exerciseId) }
          : d
      ),
    }))
  }

  function updateExercise(dayId, exerciseId, fields) {
    setPlan(p => ({
      ...p,
      days: p.days.map(d =>
        d.id === dayId
          ? {
              ...d,
              exercises: d.exercises.map(e =>
                e.id === exerciseId ? { ...e, ...fields } : e
              ),
            }
          : d
      ),
    }))
  }

  function reorderExercises(dayId, fromIndex, toIndex) {
    setPlan(p => ({
      ...p,
      days: p.days.map(d => {
        if (d.id !== dayId) return d
        const exs = [...d.exercises]
        const [moved] = exs.splice(fromIndex, 1)
        exs.splice(toIndex, 0, moved)
        return { ...d, exercises: exs }
      }),
    }))
  }

  return {
    plan,
    currentDay,
    currentDayIndex,
    advanceDay,
    addDay, removeDay, renameDay, reorderDays,
    addExercise, removeExercise, updateExercise, reorderExercises,
  }
}
