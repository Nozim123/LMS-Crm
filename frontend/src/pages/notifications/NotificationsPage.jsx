import { useState } from 'react';
import { api } from '../../api/client';

export default function NotificationsPage() {
  const [form, setForm] = useState({ channel: 'Telegram', recipient: '', message: '' });
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/notifications', form);
    setResult(data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Notifications</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-2 max-w-xl">
        <select className="input" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
          <option>Telegram</option>
          <option>SMS</option>
        </select>
        <input className="input" placeholder="Recipient" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} required />
        <textarea className="input" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        <button className="btn">Queue notification</button>
      </form>
      {result && <pre className="bg-slate-900 text-white p-3 rounded text-xs">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
