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

  function logSet(sessionId, exerciseId, setIndex, reps, weight) {
    setSessions(prev =>
      prev.map(session => {
        if (session.id !== sessionId) return session
        return {
          ...session,
          exercises: session.exercises.map(ex => {
            if (ex.exerciseId !== exerciseId) return ex
            const sets = [...ex.sets]
            sets[setIndex] = { reps, weight }
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
            return { ...ex, sets: [...ex.sets, { reps: '', weight: '' }] }
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
