import { useMemo, useRef } from 'react'
import { buildVolumeSeriesByExercise } from '../utils/chartData'
import ExerciseChart from '../components/ExerciseChart'
import styles from './ProgressView.module.css'

const KEYS = ['wl_plan', 'wl_day_index', 'wl_sessions', 'wl_notes']

function exportData() {
  const data = {}
  KEYS.forEach(k => {
    const val = localStorage.getItem(k)
    if (val !== null) data[k] = JSON.parse(val)
  })
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `workout-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ProgressView({ planApi, sessionApi }) {
  const { plan } = planApi
  const { sessions } = sessionApi
  const fileRef = useRef()

  const volumeMap = useMemo(
    () => buildVolumeSeriesByExercise(sessions),
    [sessions]
  )

  const allExercises = plan.days.flatMap(d => d.exercises)
  const exercisesWithData = allExercises.filter(
    ex => volumeMap[ex.id]?.length > 0
  )

  function importData(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        KEYS.forEach(k => {
          if (data[k] !== undefined) localStorage.setItem(k, JSON.stringify(data[k]))
        })
        window.location.reload()
      } catch {
        alert('Invalid backup file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>Progress</h1>
      {exercisesWithData.length === 0 ? (
        <div className={styles.empty}>
          <p>No data yet.</p>
          <p>Complete at least one workout to see charts here.</p>
        </div>
      ) : (
        exercisesWithData.map(ex => (
          <ExerciseChart
            key={ex.id}
            exerciseName={ex.name}
            data={volumeMap[ex.id]}
          />
        ))
      )}
      <div className={styles.backup}>
        <button className={styles.backupBtn} onClick={exportData}>Export backup</button>
        <button className={styles.backupBtn} onClick={() => fileRef.current.click()}>Import backup</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
      </div>
    </div>
  )
}
