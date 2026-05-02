import SetRow from './SetRow'
import styles from './ExerciseLogger.module.css'

export default function ExerciseLogger({
  exercise,
  sessionSets,
  onLogSet,
  onAddSet,
  onRemoveSet,
}) {
  const { name, targetSets, targetReps, targetWeight, targetRIR } = exercise

  // Always show at least targetSets rows; once the user logs past that, show all logged sets
  const displaySets =
    sessionSets.length >= targetSets
      ? sessionSets
      : [
          ...sessionSets,
          ...Array.from(
            { length: targetSets - sessionSets.length },
            () => ({ reps: '', weight: '', rir: '' })
          ),
        ]

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{name}</h2>
        <span className={styles.target}>
          {targetSets}×{targetReps}
          {targetWeight > 0 ? ` @ ${targetWeight}kg` : ''}
          {targetRIR ? ` · RIR ${targetRIR}` : ''}
        </span>
      </div>
      <div className={styles.columnLabels}>
        <span />
        <span>Reps</span>
        <span>Weight (kg)</span>
        <span>RIR</span>
        <span />
      </div>
      {displaySets.map((set, i) => (
        <SetRow
          key={i}
          index={i}
          reps={set.reps}
          weight={set.weight}
          rir={set.rir ?? ''}
          onChange={(reps, weight, rir) => onLogSet(i, reps, weight, rir)}
          onRemove={() => onRemoveSet(i)}
        />
      ))}
      <button className={styles.addSetBtn} onClick={onAddSet}>
        + Add Set
      </button>
    </section>
  )
}
