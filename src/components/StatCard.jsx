export function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-6 flex items-center gap-4 border-l-4 ${color}`}>
      <div className="text-4xl select-none">{icon}</div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{label}</div>
      </div>
    </div>
  );
}