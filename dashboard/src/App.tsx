// dashboard/src/App.tsx  ← REPLACE ENTIRE FILE WITH THIS
import { useEffect, useState } from "react"
import axios from "axios"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { format } from "date-fns"

interface Attack {
  id: number
  timestamp: string
  src_ip: string
  username: string
  password: string
  country: string
  country_code: string
  city: string
  latitude: number
  longitude: number
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

function App() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [stats, setStats] = useState<any>({})

  const fetchData = async () => {
    try {
      const [a, s] = await Promise.all([
        axios.get("http://localhost:8000/attacks"),
        axios.get("http://localhost:8000/stats")
      ])
      setAttacks(a.data)
      setStats(s.data)
    } catch (e) { console.log("waiting...") }
  }

  useEffect(() => {
    fetchData()
    const i = setInterval(fetchData, 4000)
    return () => clearInterval(i)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-6xl font-bold text-center mb-10 text-red-500">
        LIVE HONEYPOT ATTACKS
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
        <div className="bg-red-900/40 border border-red-800 rounded-xl p-8 text-center">
          <div className="text-5xl font-bold">{stats.today_attacks || 0}</div>
          <div className="text-gray-400 mt-2">Today</div>
        </div>
        <div className="bg-orange-900/40 border border-orange-800 rounded-xl p-8 text-center">
          <div className="text-5xl font-bold">{stats.total_attacks || 0}</div>
          <div className="text-gray-400 mt-2">Total</div>
        </div>
        <div className="bg-yellow-900/40 border border-yellow-800 rounded-xl p-8 text-center">
          <div className="text-5xl font-bold">{stats.unique_ips || 0}</div>
          <div className="text-gray-400 mt-2">Unique IPs</div>
        </div>
        <div className="bg-purple-900/40 border border-purple-800 rounded-xl p-8 text-center">
          <div className="text-5xl font-bold">{stats.top_countries?.[0]?.count || 0}</div>
          <div className="text-gray-400 mt-2">Top: {stats.top_countries?.[0]?.name || "—"}</div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* MAP */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Attack Origins</h2>
          <div className="h-96 rounded-xl overflow-hidden border border-gray-700">
            <ComposableMap projectionConfig={{ scale: 140 }}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) => geographies.map((geo: any) => (
                  <Geography key={geo.rsmKey} geography={geo} fill="#1a1a2e" stroke="#16213e" />
                ))}
              </Geographies>
              {attacks
                .filter(a => a.latitude && a.longitude && a.country_code !== "XX")
                .map((a, i) => (
                <Marker key={`${a.id}-${i}`} coordinates={[a.longitude, a.latitude]}>
      <circle
        cx={0}
        cy={0}
        r={8}
        fill="#ef4444"
        opacity={0.85}
        stroke="#991b1b"
        strokeWidth={3}
      >
        <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Optional: show username on hover */}
      <text
        textAnchor="middle"
        y={-15}
        style={{ fontFamily: "system-ui", fill: "#fff", fontSize: "10px" }}
      >
        {a.username}
      </text>
    </Marker>
                ))}
            </ComposableMap>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Latest Attacks</h2>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">IP</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Credentials</th>
                </tr>
              </thead>
              <tbody>
                {attacks.slice(0, 25).map(a => (
                  <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-700 transition">
                    <td className="p-3">{format(new Date(a.timestamp), "HH:mm:ss")}</td>
                    <td className="p-3 font-mono text-cyan-400">{a.src_ip}</td>
                    <td className="p-3">{a.country} • {a.city}</td>
                    <td className="p-3 font-mono text-red-400">{a.username}:{a.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App