import { useState, useEffect } from 'react'

const statusStyles = {
  online: 'bg-green-500',
  warning: 'bg-yellow-500',
  offline: 'bg-red-500',
}

function ServerHealth() {
  const [servers, setServers] = useState([])

  useEffect(() => {
    const fetchServers = () => {
      fetch('http://localhost:8000/servers')
        .then((res) => res.json())
        .then((data) => setServers(data))
        .catch((err) => console.error('Failed to fetch servers:', err))
    }

    fetchServers()
    const interval = setInterval(fetchServers, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {servers.length === 0 && (
        <p className="text-slate-400">No server data yet.</p>
      )}
      {servers.map((server) => (
        <div key={server.server_id} className="bg-slate-900 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{server.server_id}</span>
            <span className="flex items-center gap-2 text-xs text-slate-400">
              <span className={`w-2 h-2 rounded-full ${statusStyles[server.status]}`} />
              {server.status}
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${server.cpu > 80 ? 'bg-red-500' : server.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${server.cpu}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">CPU: {server.cpu}%</p>
        </div>
      ))}
    </div>
  )
}

export default ServerHealth