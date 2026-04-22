import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function HemisPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/hemis/students').then((r) => setStudents(r.data.items)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">HEMIS Student Records</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr><th className="p-2 text-left">Code</th><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th></tr></thead>
          <tbody>{students.map((s) => <tr key={s.id} className="border-t"><td className="p-2">{s.student_code}</td><td className="p-2">{s.full_name}</td><td className="p-2">{s.email}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
