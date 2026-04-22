import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { setSession } from '../../features/auth/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', tenantId: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('tenantId', form.tenantId);
    const { data } = await api.post('/auth/login', { email: form.email, password: form.password }, {
      headers: { 'x-tenant-id': form.tenantId }
    });

    dispatch(setSession(data));

    if ((data.user.roles || []).length > 1) {
      navigate('/choose-role');
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[#f4f6fb]">
      <form className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-3" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">EduCore Login</h1>
        <p className="text-xs text-slate-500">Master admin defaults: admin@educore.local / Admin123!</p>
        <input className="input" placeholder="Tenant UUID" value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} required />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn w-full">Sign in</button>
      </form>
    </div>
  );
}
