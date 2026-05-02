import styles from './SetRow.module.css'

export default function SetRow({ index, reps, weight, rir, onChange, onRemove }) {
  return (
    <div className={styles.row}>
      <span className={styles.setNum}>{index + 1}</span>
      <input
        className={styles.input}
        type="number"
        inputMode="numeric"
        placeholder="—"
        value={reps}
        onChange={e => onChange(e.target.value, weight, rir)}
        aria-label={`Set ${index + 1} reps`}
      />
      <input
        className={styles.input}
        type="number"
        inputMode="decimal"
        placeholder="—"
        value={weight}
        onChange={e => onChange(reps, e.target.value, rir)}
        aria-label={`Set ${index + 1} weight`}
      />
      <input
        className={styles.input}
        type="number"
        inputMode="numeric"
        min="0"
        max="5"
        placeholder="—"
        value={rir ?? ''}
        onChange={e => onChange(reps, weight, e.target.value)}
        aria-label={`Set ${index + 1} reps in reserve`}
      />
      <button className={styles.remove} onClick={onRemove} aria-label="Remove set">
        ×
      </button>
    </div>
  )
}
