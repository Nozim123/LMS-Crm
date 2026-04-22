import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get('/payment/invoices').then((r) => setInvoices(r.data.items)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Payments & Invoices</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr><th className="p-2">Amount</th><th className="p-2">Due</th><th className="p-2">Status</th></tr></thead>
          <tbody>{invoices.map((i) => <tr key={i.id} className="border-t"><td className="p-2">{i.amount}</td><td className="p-2">{String(i.due_date).slice(0,10)}</td><td className="p-2">{i.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
