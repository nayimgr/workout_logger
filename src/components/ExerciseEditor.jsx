import styles from './ExerciseEditor.module.css'

export default function ExerciseEditor({ exercise, onUpdate, onRemove, dragHandleProps }) {
  return (
    <div className={styles.row}>
      <span className={styles.handle} {...dragHandleProps} title="Drag to reorder">
        ⠿
      </span>
      <input
        className={`${styles.field} ${styles.name}`}
        value={exercise.name}
        onChange={e => onUpdate({ name: e.target.value })}
        placeholder="Exercise name"
      />
      <input
        className={`${styles.field} ${styles.sets}`}
        type="number"
        inputMode="numeric"
        value={exercise.targetSets}
        onChange={e => onUpdate({ targetSets: Number(e.target.value) })}
        aria-label="Target sets"
        title="Sets"
        min="1"
      />
      <span className={styles.sep}>×</span>
      <input
        className={`${styles.field} ${styles.reps}`}
        type="number"
        inputMode="numeric"
        value={exercise.targetReps}
        onChange={e => onUpdate({ targetReps: Number(e.target.value) })}
        aria-label="Target reps"
        title="Reps"
        min="1"
      />
      <span className={styles.sep}>@</span>
      <input
        className={`${styles.field} ${styles.weight}`}
        type="number"
        inputMode="decimal"
        value={exercise.targetWeight}
        onChange={e => onUpdate({ targetWeight: Number(e.target.value) })}
        aria-label="Target weight kg"
        title="Weight (kg)"
        min="0"
      />
      <button className={styles.remove} onClick={onRemove} aria-label="Remove exercise">
        ×
      </button>
    </div>
  )
}
