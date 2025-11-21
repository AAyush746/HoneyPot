import { useEffect, useState } from "react"
import axios from "axios"
import type { Attack } from "./types/Attack"
import AttackTable from "./components/AttackTable"
import StatsCards from "./components/StatsCards"
import CountryMap from "./components/CountryMap"

function App() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [stats, setStats] = useState<any>({})

  const fetchData = async () => {
    try {
      const [aRes, sRes] = await Promise.all([
        axios.get("http://localhost:8000/attacks"),
        axios.get("http://localhost:8000/stats")
      ])
      setAttacks(aRes.data)
      setStats(sRes.data)
    } catch (e) {
      console.log("API not ready...")
    }
  }

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-red-500">
          Honeypot Live Attack Monitor
        </h1>

        <StatsCards stats={stats} />

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Attack Origins</h2>
            <div className="h-96">
              <CountryMap attacks={attacks} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Latest Attacks (Live)</h2>
            <AttackTable attacks={attacks.slice(0, 25)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App