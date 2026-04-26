// Returns { [exerciseId]: [{ date: 'YYYY-MM-DD', volume: number }] }
// volume = sum of (reps * weight) for all sets, aggregated across sessions on the same day
export function buildVolumeSeriesByExercise(sessions) {
  // Use nested maps: exerciseId -> date -> total volume
  const raw = {}

  for (const session of sessions) {
    const dateLabel = session.date.slice(0, 10)
    for (const ex of session.exercises) {
      const volume = ex.sets.reduce((sum, set) => {
        if (!set) return sum
        const r = parseFloat(set.reps) || 0
        const w = parseFloat(set.weight) || 0
        return sum + r * w
      }, 0)
      if (!raw[ex.exerciseId]) raw[ex.exerciseId] = {}
      raw[ex.exerciseId][dateLabel] = (raw[ex.exerciseId][dateLabel] || 0) + volume
    }
  }

  const result = {}
  for (const id in raw) {
    result[id] = Object.entries(raw[id])
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return result
}
