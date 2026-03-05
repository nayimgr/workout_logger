import SetRow from './SetRow'
import styles from './ExerciseLogger.module.css'

export default function ExerciseLogger({
  exercise,
  sessionSets,
  onLogSet,
  onAddSet,
  onRemoveSet,
}) {
  const { name, targetSets, targetReps, targetWeight } = exercise

  // Pre-fill empty rows up to targetSets if none logged yet
  const displaySets =
    sessionSets.length > 0
      ? sessionSets
      : Array.from({ length: targetSets }, () => ({ reps: '', weight: '' }))

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{name}</h2>
        <span className={styles.target}>
          {targetSets}×{targetReps}
          {targetWeight > 0 ? ` @ ${targetWeight}kg` : ''}
        </span>
      </div>
      <div className={styles.columnLabels}>
        <span />
        <span>Reps</span>
        <span>Weight (kg)</span>
        <span />
      </div>
      {displaySets.map((set, i) => (
        <SetRow
          key={i}
          index={i}
          reps={set.reps}
          weight={set.weight}
          onChange={(reps, weight) => onLogSet(i, reps, weight)}
          onRemove={() => onRemoveSet(i)}
        />
      ))}
      <button className={styles.addSetBtn} onClick={onAddSet}>
        + Add Set
      </button>
    </section>
  )
}
