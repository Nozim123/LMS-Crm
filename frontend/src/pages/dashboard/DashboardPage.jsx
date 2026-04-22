import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import DataCard from '../../components/ui/DataCard';

export default function DashboardPage() {
  const [stats, setStats] = useState({ studentsCount: 0, monthlyRevenue: 0, attendanceRate: 0 });

  useEffect(() => {
    api.get('/dashboard/overview').then((res) => setStats(res.data.stats)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard title="Students" value={stats.studentsCount} />
        <DataCard title="Revenue" value={`$${stats.monthlyRevenue}`} />
        <DataCard title="Attendance" value={`${stats.attendanceRate}%`} />
      </div>
    </div>
  );
}
