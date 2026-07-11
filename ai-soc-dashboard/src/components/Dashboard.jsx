function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">AI SOC Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-4 h-80 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-3">Live Logs</h2>
          <p className="text-slate-400">Logs will go here</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 h-80 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-3">Active Alerts</h2>
          <p className="text-slate-400">Alerts will go here</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 h-80 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-3">Server Health</h2>
          <p className="text-slate-400">Server cards will go here</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 h-80 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-3">Charts</h2>
          <p className="text-slate-400">Charts will go here</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard