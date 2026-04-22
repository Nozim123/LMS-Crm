import { useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { firestore } from '../../firebase/client';

const CATEGORIES = ['Follow-up', 'Reminder', 'Enrollment Confirmation'];
const EMPTY_FORM = { title: '', category: CATEGORIES[0], content: '' };

export default function SMSTemplatesPage() {
  const { tenantId, activeRole } = useSelector((s) => s.auth);
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tenantId) return;

    const templatesRef = collection(firestore, 'organizations', tenantId, 'sms_templates');
    const q = query(templatesRef, where('orgId', '==', tenantId), orderBy('updatedAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTemplates(items);
      },
      (err) => setError(err.message)
    );

    return () => unsub();
  }, [tenantId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return templates.filter((t) => {
      const matchesCategory = category === 'All' || t.category === category;
      const matchesSearch = !q || t.title?.toLowerCase().includes(q) || t.content?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [templates, category, search]);

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.content.trim()) return 'Content is required.';
    if (!CATEGORIES.includes(form.category)) return 'Category is invalid.';
    return '';
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setIsOpen(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({ title: t.title || '', category: t.category || CATEGORIES[0], content: t.content || '' });
    setError('');
    setIsOpen(true);
  };

  const saveTemplate = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    if (!['Admin', 'SuperAdmin', 'admin', 'super_admin'].includes(activeRole)) {
      setError('Only admin users can manage SMS templates.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      orgId: tenantId,
      updatedAt: serverTimestamp()
    };

    if (editingId) {
      await updateDoc(doc(firestore, 'organizations', tenantId, 'sms_templates', editingId), payload);
    } else {
      await addDoc(collection(firestore, 'organizations', tenantId, 'sms_templates'), {
        ...payload,
        createdAt: serverTimestamp(),
        createdByRole: activeRole
      });
    }

    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <h2 className="text-2xl font-semibold">SMS Templates</h2>
        <button className="btn" onClick={openCreate}>New Template</button>
      </div>

      <div className="bg-white rounded shadow p-3 grid md:grid-cols-2 gap-2">
        <input
          className="input"
          placeholder="Search by title or content"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded shadow p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{t.title}</h3>
              <span className="text-xs bg-slate-200 px-2 py-1 rounded">{t.category}</span>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{t.content}</p>
            <button className="btn" onClick={() => openEdit(t)}>Edit</button>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <form className="bg-white rounded-lg shadow w-full max-w-xl p-4 space-y-3" onSubmit={saveTemplate}>
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Template' : 'Create Template'}</h3>
            <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <textarea className="input min-h-32" placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-3 py-2 rounded border" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="btn">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
