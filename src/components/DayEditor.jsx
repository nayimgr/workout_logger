import { useState } from 'react'
import ExerciseEditor from './ExerciseEditor'
import styles from './DayEditor.module.css'

export default function DayEditor({
  day,
  onRename,
  onUpdateDay,
  onRemoveDay,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
  onReorderExercises,
  onDragStart,
  onDragOver,
  onDragEnd,
}) {
  const [newExName, setNewExName] = useState('')
  const [exDragFrom, setExDragFrom] = useState(null)

  function handleAddExercise() {
    const trimmed = newExName.trim()
    if (!trimmed) return
    onAddExercise(trimmed)
    setNewExName('')
  }

  function onExDragStart(index) { setExDragFrom(index) }
  function onExDragOver(e, index) {
    e.preventDefault()
    if (exDragFrom !== null && exDragFrom !== index) {
      onReorderExercises(exDragFrom, index)
      setExDragFrom(index)
    }
  }
  function onExDragEnd() { setExDragFrom(null) }

  return (
    <div
      className={styles.card}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className={styles.dayHeader}>
        <span className={styles.dragIcon}>⠿</span>
        <input
          className={styles.dayName}
          value={day.name}
          onChange={e => onRename(e.target.value)}
          placeholder="Day name"
        />
        <button className={styles.removeDay} onClick={onRemoveDay} aria-label="Remove day">
          🗑
        </button>
      </div>

      <details className={styles.warmup}>
        <summary className={styles.warmupSummary}>Warmup &amp; prehab (markdown)</summary>
        <textarea
          className={styles.warmupField}
          value={day.warmup ?? ''}
          onChange={e => onUpdateDay({ warmup: e.target.value })}
          placeholder="e.g.&#10;- Bike 3–5 min&#10;- Band shoulder openers 1×10&#10;- Wall slides 1×10"
          rows={4}
        />
      </details>

      <div className={styles.exHeader}>
        <span style={{ width: '1rem' }} />
        <span className={styles.colLabel} style={{ flex: 1 }}>Exercise</span>
        <span className={styles.colLabel}>Sets</span>
        <span style={{ width: '1rem' }} />
        <span className={styles.colLabel}>Reps</span>
        <span style={{ width: '1rem' }} />
        <span className={styles.colLabel}>kg</span>
        <span style={{ width: '1rem' }} />
        <span className={styles.colLabel}>RIR</span>
        <span style={{ width: '2rem' }} />
      </div>

      {day.exercises.map((ex, index) => (
        <div
          key={ex.id}
          draggable
          onDragStart={e => { e.stopPropagation(); onExDragStart(index) }}
          onDragOver={e => { e.stopPropagation(); onExDragOver(e, index) }}
          onDragEnd={e => { e.stopPropagation(); onExDragEnd() }}
        >
          <ExerciseEditor
            exercise={ex}
            onUpdate={fields => onUpdateExercise(ex.id, fields)}
            onRemove={() => onRemoveExercise(ex.id)}
            dragHandleProps={{}}
          />
        </div>
      ))}

      {day.exercises.length === 0 && (
        <p className={styles.empty}>No exercises yet.</p>
      )}

      <div className={styles.addEx}>
        <input
          className={styles.exInput}
          placeholder="New exercise name"
          value={newExName}
          onChange={e => setNewExName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddExercise()}
        />
        <button className={styles.addBtn} onClick={handleAddExercise}>Add</button>
      </div>
    </div>
  )
}
