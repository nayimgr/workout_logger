import { useMemo } from 'react'
import { buildVolumeSeriesByExercise } from '../utils/chartData'
import ExerciseChart from '../components/ExerciseChart'
import styles from './ProgressView.module.css'

export default function ProgressView({ planApi, sessionApi }) {
  const { plan } = planApi
  const { sessions } = sessionApi

  const volumeMap = useMemo(
    () => buildVolumeSeriesByExercise(sessions),
    [sessions]
  )

  const allExercises = plan.days.flatMap(d => d.exercises)
  const exercisesWithData = allExercises.filter(
    ex => volumeMap[ex.id]?.length > 0
  )

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
    </div>
  )
}
