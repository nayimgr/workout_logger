import { useState } from 'react'
import { useWorkoutPlan } from './hooks/useWorkoutPlan'
import { useSessions } from './hooks/useSessions'
import TabBar from './components/TabBar'
import HomeView from './views/HomeView'
import PlanEditorView from './views/PlanEditorView'
import ProgressView from './views/ProgressView'
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
        {activeTab === 'progress' && (
          <ProgressView planApi={planApi} sessionApi={sessionApi} />
        )}
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
