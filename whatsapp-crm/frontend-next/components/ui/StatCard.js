export default function StatCard({ title, value, icon: Icon, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
