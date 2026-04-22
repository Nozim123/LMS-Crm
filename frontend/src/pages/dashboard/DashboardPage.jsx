import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../api/client';

function Panel({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 min-h-40">
      <h3 className="text-2xl font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold text-blue-700">{value}</p>
      <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ studentsCount: 0, monthlyRevenue: 0, attendanceRate: 0 });
  const [loading, setLoading] = useState(true);
  const activeRole = useSelector((s) => s.auth.activeRole);

  const load = () => {
    setLoading(true);
    api.get('/dashboard/overview').then((res) => setStats(res.data.stats)).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!activeRole) return;
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [activeRole]);

  if (!activeRole) return <p>Waiting for role selection...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">Dashboard</h2>
        <button className="btn" onClick={load}>Boshqaruv</button>
      </div>

      {loading ? <p>Loading dashboard...</p> : (
        <div className="grid md:grid-cols-3 gap-4">
          <Panel title="Topshiriqlar" value={stats.studentsCount} subtitle="Aktiv talabalar soni" />
          <Panel title="Dars jadvali" value={`$${stats.monthlyRevenue}`} subtitle="Oylik tushum" />
          <Panel title="O'zlashtirish" value={`${stats.attendanceRate}%`} subtitle="Davomat foizi" />
        </div>
      )}
    </div>
  );
}
