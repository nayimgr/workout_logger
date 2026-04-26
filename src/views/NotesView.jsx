import { useState } from 'react'
import { marked } from 'marked'
import { useStorage } from '../hooks/useStorage'
import styles from './NotesView.module.css'

function toHtml(text) {
  try {
    return marked.parse(text, { async: false })
  } catch {
    return ''
  }
}

export default function NotesView() {
  const [rawNotes, setNotes] = useStorage('wl_notes', '')
  // Normalise: localStorage could contain non-string data from a bad import
  const notes = typeof rawNotes === 'string' ? rawNotes : ''

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(notes)

  function handleEdit() {
    setDraft(notes)
    setEditing(true)
  }

  function handleSave() {
    setNotes(draft)
    setEditing(false)
  }

  return (
    <div className={styles.view}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Notes</h1>
        {!editing && (
          <button className={styles.editBtn} onClick={handleEdit}>Edit</button>
        )}
      </div>
      {editing ? (
        <>
          <textarea
            className={styles.textarea}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            placeholder="Write your notes here..."
          />
          <button className={styles.saveBtn} onClick={handleSave}>Save</button>
        </>
      ) : (
        <div className={styles.content}>
          {notes
            ? <div
                className={styles.markdown}
                dangerouslySetInnerHTML={{ __html: toHtml(notes) }}
              />
            : <p className={styles.empty}>No notes yet. Tap Edit to add some.</p>
          }
        </div>
      )}
    </div>
  )
}
