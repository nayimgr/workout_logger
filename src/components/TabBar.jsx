import styles from './TabBar.module.css'

const TABS = [
  { id: 'home',     label: 'Today',    icon: '🏋️' },
  { id: 'plan',     label: 'Plan',     icon: '📋' },
  { id: 'progress', label: 'Progress', icon: '📈' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className={styles.tabBar}>
      {TABS.map(t => (
        <button
          key={t.id}
          className={`${styles.tab} ${activeTab === t.id ? styles.active : ''}`}
          onClick={() => onTabChange(t.id)}
          aria-current={activeTab === t.id ? 'page' : undefined}
        >
          <span className={styles.icon}>{t.icon}</span>
          <span className={styles.label}>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
