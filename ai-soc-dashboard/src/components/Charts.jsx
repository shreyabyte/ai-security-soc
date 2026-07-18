import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { mockLogs } from '../mockData'

const severityColors = {
  info: '#60a5fa',
  warning: '#facc15',
  critical: '#f87171',
}

function getSeverityCounts() {
  const counts = { info: 0, warning: 0, critical: 0 }
  mockLogs.forEach((log) => {
    counts[log.severity] = (counts[log.severity] || 0) + 1
  })
  return Object.keys(counts).map((severity) => ({
    severity,
    count: counts[severity],
  }))
}

function Charts() {
  const data = getSeverityCounts()

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="severity" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" allowDecimals={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
        />
        <Bar dataKey="count">
          {data.map((entry) => (
            <Cell key={entry.severity} fill={severityColors[entry.severity]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Charts