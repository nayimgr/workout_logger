import { useState } from 'react'
import DayEditor from '../components/DayEditor'
import styles from './PlanEditorView.module.css'

export default function PlanEditorView({ planApi }) {
  const {
    plan,
    addDay, removeDay, renameDay, reorderDays,
    addExercise, removeExercise, updateExercise, reorderExercises,
  } = planApi

  const [newDayName, setNewDayName] = useState('')
  const [dragFrom, setDragFrom] = useState(null)

  function handleAddDay() {
    const trimmed = newDayName.trim()
    if (!trimmed) return
    addDay(trimmed)
    setNewDayName('')
  }

  function onDragStart(index) { setDragFrom(index) }
  function onDragOver(e, index) {
    e.preventDefault()
    if (dragFrom !== null && dragFrom !== index) {
      reorderDays(dragFrom, index)
      setDragFrom(index)
    }
  }
  function onDragEnd() { setDragFrom(null) }

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>Workout Plan</h1>
      <p className={styles.hint}>Drag cards to reorder days.</p>

      {plan.days.map((day, index) => (
        <DayEditor
          key={day.id}
          day={day}
          index={index}
          onRename={name => renameDay(day.id, name)}
          onRemoveDay={() => removeDay(day.id)}
          onAddExercise={name => addExercise(day.id, name)}
          onRemoveExercise={exId => removeExercise(day.id, exId)}
          onUpdateExercise={(exId, fields) => updateExercise(day.id, exId, fields)}
          onReorderExercises={(from, to) => reorderExercises(day.id, from, to)}
          onDragStart={() => onDragStart(index)}
          onDragOver={e => onDragOver(e, index)}
          onDragEnd={onDragEnd}
        />
      ))}

      <div className={styles.addDay}>
        <input
          className={styles.dayInput}
          placeholder="New day name (e.g. Day D — Arms)"
          value={newDayName}
          onChange={e => setNewDayName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddDay()}
        />
        <button className={styles.addBtn} onClick={handleAddDay}>
          Add Day
        </button>
      </div>
    </div>
  )
}
