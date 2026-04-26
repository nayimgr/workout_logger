// Returns { [exerciseId]: [{ date: 'YYYY-MM-DD', volume: number, avgWeight: number|null }] }
// volume    = sum(reps * weight) across all sets for that day
// avgWeight = volume / totalReps for that day (null when no reps logged)
export function buildVolumeSeriesByExercise(sessions) {
  // exerciseId -> date -> running { volume, reps } totals
  const raw = {}

  for (const session of sessions) {
    const dateLabel = session.date.slice(0, 10)
    for (const ex of session.exercises) {
      let vol = 0, reps = 0
      for (const set of ex.sets) {
        if (!set) continue
        const r = parseFloat(set.reps) || 0
        const w = parseFloat(set.weight) || 0
        vol += r * w
        reps += r
      }
      if (!raw[ex.exerciseId]) raw[ex.exerciseId] = {}
      if (!raw[ex.exerciseId][dateLabel]) raw[ex.exerciseId][dateLabel] = { volume: 0, reps: 0 }
      raw[ex.exerciseId][dateLabel].volume += vol
      raw[ex.exerciseId][dateLabel].reps += reps
    }
  }

  const result = {}
  for (const id in raw) {
    result[id] = Object.entries(raw[id])
      .map(([date, { volume, reps }]) => ({
        date,
        volume,
        avgWeight: reps > 0 ? Math.round((volume / reps) * 10) / 10 : null,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return result
}
