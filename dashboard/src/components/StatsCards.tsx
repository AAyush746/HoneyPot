export default function StatsCards({ stats }: any) {
  if (!stats.total_attacks) return <div className="text-center py-10">Loading stats...</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-red-900/50 border border-red-800 rounded-lg p-6">
        <div className="text-3xl font-bold">{stats.today_attacks || 0}</div>
        <div className="text-gray-400">Attacks Today</div>
      </div>
      <div className="bg-orange-900/50 border border-orange-800 rounded-lg p-6">
        <div className="text-3xl font-bold">{stats.total_attacks || 0}</div>
        <div className="text-gray-400">Total Attacks</div>
      </div>
      <div className="bg-yellow-900/50 border border-yellow-800 rounded-lg p-6">
        <div className="text-3xl font-bold">{stats.unique_ips || 0}</div>
        <div className="text-gray-400">Unique IPs</div>
      </div>
      <div className="bg-purple-900/50 border border-purple-800 rounded-lg p-6">
        <div className="text-3xl font-bold">{stats.top_countries?.[0]?.count || 0}</div>
        <div className="text-gray-400">
          Top: {stats.top_countries?.[0]?.name || "N/A"}
        </div>
      </div>
    </div>
  )
}