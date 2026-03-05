import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import styles from './ExerciseChart.module.css'

export default function ExerciseChart({ exerciseName, data }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{exerciseName}</h2>
      <p className={styles.subtitle}>Volume load (kg × reps) per session</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#666', fontSize: 10 }}
            tickFormatter={d => d.slice(5)}
          />
          <YAxis tick={{ fill: '#666', fontSize: 10 }} width={38} />
          <Tooltip
            contentStyle={{ background: '#16213e', border: '1px solid #2a3a5c', fontSize: 12 }}
            labelStyle={{ color: '#aaa' }}
            itemStyle={{ color: '#4fc3f7' }}
            formatter={v => [`${v} kg·reps`, 'Volume']}
          />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#4fc3f7"
            strokeWidth={2}
            dot={{ r: 4, fill: '#4fc3f7', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
