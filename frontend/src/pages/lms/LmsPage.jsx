import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function LmsPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });

  const load = () => api.get('/lms/courses').then((r) => setCourses(r.data.items));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/lms/courses', form);
    setForm({ title: '', description: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">LMS Courses</h2>
      <form className="bg-white p-4 rounded shadow grid gap-2" onSubmit={submit}>
        <input className="input" placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn">Create Course</button>
      </form>
      <div className="grid gap-2">
        {courses.map((c) => <div key={c.id} className="bg-white p-4 rounded shadow">{c.title}</div>)}
      </div>
    </div>
  );
}
