import type { Attack } from "../types/Attack"
import { format } from "date-fns"

export default function AttackTable({ attacks }: { attacks: Attack[] }) {
  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-gray-800">
          <tr>
            <th className="text-left p-2">Time</th>
            <th className="text-left p-2">IP</th>
            <th className="text-left p-2">Location</th>
            <th className="text-left p-2">Username:Password</th>
          </tr>
        </thead>
        <tbody>
          {attacks.map(a => (
            <tr key={a.id} className="border-t border-gray-800 hover:bg-gray-800">
              <td className="p-2">{format(new Date(a.timestamp), "HH:mm:ss")}</td>
              <td className="p-2 font-mono">{a.src_ip}</td>
              <td className="p-2">{a.country} ({a.city})</td>
              <td className="p-2 font-mono text-red-400">
                {a.username}:{a.password}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}