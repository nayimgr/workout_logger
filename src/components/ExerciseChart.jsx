import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import styles from './ExerciseChart.module.css'

const COLOR_VOLUME = '#4fc3f7'     // cyan  — left axis
const COLOR_AVG    = '#fb923c'     // orange — right axis

function tooltipFormatter(value, name) {
  if (name === 'Volume')      return [`${value} kg·reps`, name]
  if (name === 'Avg kg/rep')  return [value != null ? `${value} kg` : '—', name]
  return [value, name]
}

function formatTickDate(t) {
  return new Date(t).toISOString().slice(5, 10)
}

export default function ExerciseChart({ exerciseName, data, xDomain }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{exerciseName}</h2>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
          <XAxis
            type="number"
            dataKey="t"
            domain={xDomain}
            scale="time"
            tick={{ fill: '#666', fontSize: 10 }}
            tickFormatter={formatTickDate}
            allowDataOverflow
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: COLOR_VOLUME, fontSize: 10 }}
            width={42}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: COLOR_AVG, fontSize: 10 }}
            width={42}
          />
          <Tooltip
            contentStyle={{ background: '#16213e', border: '1px solid #2a3a5c', fontSize: 12 }}
            labelStyle={{ color: '#aaa' }}
            formatter={tooltipFormatter}
            labelFormatter={formatTickDate}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="volume"
            name="Volume"
            stroke={COLOR_VOLUME}
            strokeWidth={2}
            dot={{ r: 3, fill: COLOR_VOLUME, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgWeight"
            name="Avg kg/rep"
            stroke={COLOR_AVG}
            strokeWidth={2}
            dot={{ r: 3, fill: COLOR_AVG, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
