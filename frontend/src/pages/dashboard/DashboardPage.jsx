export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded p-4 shadow">Students: 0</div>
        <div className="bg-white rounded p-4 shadow">Revenue: $0</div>
        <div className="bg-white rounded p-4 shadow">Attendance: 0%</div>
      </div>
    </div>
  );
}
