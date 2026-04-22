import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function CrmPage() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ studentName: '', parentName: '', phone: '', source: '' });

  const load = () => api.get('/crm/leads').then((r) => setLeads(r.data.items));

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/crm/leads', form);
    setForm({ studentName: '', parentName: '', phone: '', source: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">CRM Leads (Real-time)</h2>
      <form onSubmit={submit} className="grid md:grid-cols-4 gap-2 bg-white p-4 rounded shadow">
        <input className="input" placeholder="Student" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required />
        <input className="input" placeholder="Parent" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input className="input" placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
        <button className="btn md:col-span-4">Add Lead</button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr><th className="p-2 text-left">Student</th><th className="p-2 text-left">Parent</th><th className="p-2">Phone</th><th className="p-2">Stage</th></tr></thead>
          <tbody>{leads.map((l) => <tr key={l.id} className="border-t"><td className="p-2">{l.student_name}</td><td className="p-2">{l.parent_name}</td><td className="p-2">{l.phone}</td><td className="p-2">{l.stage}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
