import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const severityColors = {
  info: '#60a5fa',
  warning: '#facc15',
  critical: '#f87171',
}

function getSeverityCounts(logs) {
  const counts = { info: 0, warning: 0, critical: 0 }
  logs.forEach((log) => {
    counts[log.severity] = (counts[log.severity] || 0) + 1
  })
  return Object.keys(counts).map((severity) => ({
    severity,
    count: counts[severity],
  }))
}

function Charts() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const fetchLogs = () => {
      fetch('http://localhost:8000/logs')
        .then((res) => res.json())
        .then((data) => setLogs(data))
        .catch((err) => console.error('Failed to fetch logs:', err))
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 3000)

    return () => clearInterval(interval)
  }, [])

  const data = getSeverityCounts(logs)

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