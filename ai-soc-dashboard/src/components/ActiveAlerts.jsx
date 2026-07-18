import { mockAlerts } from '../mockData'

const severityStyles = {
  info: 'border-blue-400 text-blue-400',
  warning: 'border-yellow-400 text-yellow-400',
  critical: 'border-red-400 text-red-400',
}

function ActiveAlerts() {
  return (
    <div className="space-y-2">
      {mockAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-slate-900 rounded-lg p-3 text-sm border-l-4 ${severityStyles[alert.severity]}`}
        >
          <div className="flex justify-between items-start">
            <span className="font-semibold">{alert.rule_triggered}</span>
            <span className="text-slate-500 text-xs whitespace-nowrap ml-3">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-slate-400 mt-1">
            {alert.server_id} — {alert.severity.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ActiveAlerts