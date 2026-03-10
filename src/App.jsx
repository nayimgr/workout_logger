import { useState } from 'react'
import { useWorkoutPlan } from './hooks/useWorkoutPlan'
import { useSessions } from './hooks/useSessions'
import TabBar from './components/TabBar'
import HomeView from './views/HomeView'
import PlanEditorView from './views/PlanEditorView'
import ProgressView from './views/ProgressView'
import HistoryView from './views/HistoryView'
import NotesView from './views/NotesView'
import styles from './App.module.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const planApi = useWorkoutPlan()
  const sessionApi = useSessions()

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        {activeTab === 'home' && (
          <HomeView planApi={planApi} sessionApi={sessionApi} />
        )}
        {activeTab === 'plan' && (
          <PlanEditorView planApi={planApi} />
        )}
        {activeTab === 'history' && (
          <HistoryView planApi={planApi} sessionApi={sessionApi} />
        )}
        {activeTab === 'progress' && (
          <ProgressView planApi={planApi} sessionApi={sessionApi} />
        )}
        {activeTab === 'notes' && (
          <NotesView />
        )}
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
