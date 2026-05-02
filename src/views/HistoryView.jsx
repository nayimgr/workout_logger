import styles from './HistoryView.module.css'

export default function HistoryView({ planApi, sessionApi }) {
  const { plan } = planApi
  const { sessions } = sessionApi

  const exerciseById = {}
  plan.days.forEach(d => d.exercises.forEach(e => { exerciseById[e.id] = e }))

  const dayById = {}
  plan.days.forEach(d => { dayById[d.id] = d })

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date))

  if (sorted.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No sessions yet.</p>
        <p>Complete a workout to see history here.</p>
      </div>
    )
  }

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>History</h1>
      {sorted.map(session => {
        const day = dayById[session.dayId]
        const date = new Date(session.date)
        const dateStr = date.toLocaleDateString(undefined, {
          weekday: 'short', month: 'short', day: 'numeric',
        })
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        return (
          <div key={session.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.dayName}>{day?.name ?? 'Unknown day'}</span>
              <span className={styles.date}>{dateStr} · {timeStr}</span>
            </div>
            {session.exercises.map(ex => {
              const exInfo = exerciseById[ex.exerciseId]
              if (!exInfo || ex.sets.length === 0) return null
              return (
                <div key={ex.exerciseId} className={styles.exercise}>
                  <div className={styles.exName}>{exInfo.name}</div>
                  <div className={styles.sets}>
                    {ex.sets.map((set, i) => {
                      if (!set) return null
                      const reps = parseFloat(set.reps)
                      const weight = parseFloat(set.weight)
                      const rir = parseFloat(set.rir)
                      const hasData = !isNaN(reps) || !isNaN(weight)
                      if (!hasData) return null
                      return (
                        <span key={i} className={styles.set}>
                          {!isNaN(reps) ? `${reps}` : '?'}
                          {!isNaN(weight) && weight > 0 ? ` × ${weight}kg` : ' reps'}
                          {!isNaN(rir) ? ` · RIR ${rir}` : ''}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
