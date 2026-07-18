import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL;

const severityColors = {
  info: 'text-blue-400',
  warning: 'text-yellow-400',
  critical: 'text-red-400',
}

function LiveLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
  const fetchLogs = () => {
    fetch(`${API_URL}/logs`)
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error('Failed to fetch logs:', err))
  }

  fetchLogs()
  const interval = setInterval(fetchLogs, 3000)

  return () => clearInterval(interval)
}, [])

  return (
    <div className="space-y-2">
      {logs.length === 0 && (
        <p className="text-slate-400">No logs yet. Send one via /docs to see it here.</p>
      )}
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-slate-900 rounded-lg p-3 text-sm flex justify-between items-start"
        >
          <div>
            <span className="font-semibold">{log.server_id}</span>{' '}
            <span className={severityColors[log.severity]}>
              [{log.event_type}]
            </span>
            <p className="text-slate-400 mt-1">{log.details}</p>
          </div>
          <span className="text-slate-500 text-xs whitespace-nowrap ml-3">
            {new Date(log.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default LiveLogs