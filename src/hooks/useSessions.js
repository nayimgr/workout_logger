import { useStorage } from './useStorage'

export function useSessions() {
  const [sessions, setSessions] = useStorage('wl_sessions', [])

  function startSession(dayId, exercises) {
    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      dayId,
      exercises: exercises.map(e => ({ exerciseId: e.id, sets: [] })),
    }
    setSessions(s => [...s, session])
    return session.id
  }

  function logSet(sessionId, exerciseId, setIndex, reps, weight, rir) {
    setSessions(prev =>
      prev.map(session => {
        if (session.id !== sessionId) return session
        return {
          ...session,
          exercises: session.exercises.map(ex => {
            if (ex.exerciseId !== exerciseId) return ex
            const sets = [...ex.sets]
            // Fill any gaps so we never produce a sparse array
            while (sets.length <= setIndex) sets.push({ reps: '', weight: '', rir: '' })
            sets[setIndex] = { reps, weight, rir }
            return { ...ex, sets }
          }),
        }
      })
    )
  }

  function addSet(sessionId, exerciseId) {
    setSessions(prev =>
      prev.map(session => {
        if (session.id !== sessionId) return session
        return {
          ...session,
          exercises: session.exercises.map(ex => {
            if (ex.exerciseId !== exerciseId) return ex
            return { ...ex, sets: [...ex.sets, { reps: '', weight: '', rir: '' }] }
          }),
        }
      })
    )
  }

  function removeSet(sessionId, exerciseId, setIndex) {
    setSessions(prev =>
      prev.map(session => {
        if (session.id !== sessionId) return session
        return {
          ...session,
          exercises: session.exercises.map(ex => {
            if (ex.exerciseId !== exerciseId) return ex
            return { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
          }),
        }
      })
    )
  }

  return { sessions, startSession, logSet, addSet, removeSet }
}
