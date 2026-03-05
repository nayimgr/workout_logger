// Returns { [exerciseId]: [{ date: 'YYYY-MM-DD', volume: number }] }
// volume = sum of (reps * weight) for all sets in a session
export function buildVolumeSeriesByExercise(sessions) {
  const map = {}

  for (const session of sessions) {
    const dateLabel = session.date.slice(0, 10)
    for (const ex of session.exercises) {
      const volume = ex.sets.reduce((sum, set) => {
        const r = parseFloat(set.reps) || 0
        const w = parseFloat(set.weight) || 0
        return sum + r * w
      }, 0)
      if (!map[ex.exerciseId]) map[ex.exerciseId] = []
      map[ex.exerciseId].push({ date: dateLabel, volume })
    }
  }

  for (const id in map) {
    map[id].sort((a, b) => a.date.localeCompare(b.date))
  }

  return map
}
