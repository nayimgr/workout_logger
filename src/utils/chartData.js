// Returns { seriesByExercise, xDomain }
//   seriesByExercise[exerciseId] = [{ date, t, volume, avgWeight }] — only days the exercise was worked
//   xDomain = [minTimestamp, maxTimestamp] across all sessions, so every chart shares the same x-axis
//
// volume    = sum(reps * weight) across all sets that day
// avgWeight = volume / totalReps that day
export function buildVolumeSeriesByExercise(sessions) {
  // exerciseId -> date -> running { volume, reps } totals
  const raw = {}
  let xMin = Infinity
  let xMax = -Infinity

  for (const session of sessions) {
    const dateLabel = session.date.slice(0, 10)
    const t = Date.parse(dateLabel)
    if (!Number.isNaN(t)) {
      if (t < xMin) xMin = t
      if (t > xMax) xMax = t
    }
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

  const seriesByExercise = {}
  for (const id in raw) {
    seriesByExercise[id] = Object.entries(raw[id])
      .filter(([, { reps }]) => reps > 0)
      .map(([date, { volume, reps }]) => ({
        date,
        t: Date.parse(date),
        volume,
        avgWeight: Math.round((volume / reps) * 10) / 10,
      }))
      .sort((a, b) => a.t - b.t)
  }

  const xDomain = xMin === Infinity ? [0, 0] : [xMin, xMax]
  return { seriesByExercise, xDomain }
}
