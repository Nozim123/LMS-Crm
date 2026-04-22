import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setActiveRole } from '../../features/auth/authSlice';

export default function SettingsPage() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { roles, activeRole, user } = useSelector((s) => s.auth);
  const [modules, setModules] = useState({
    lms: true,
    crm: true,
    hemis: true,
    payments: true,
    notifications: true,
    smsTemplates: true
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Admin Control Center</h2>
      <p className="text-slate-600">You are logged in as <b>{user?.email}</b>. From here you can control all core modules.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="font-semibold mb-3">Full Access Roles</h3>
          <p className="text-sm text-slate-500 mb-2">Active role: {activeRole}</p>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button key={role} className={`px-3 py-1 rounded border ${activeRole === role ? 'bg-blue-600 text-white' : ''}`} onClick={() => dispatch(setActiveRole(role))}>
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <h3 className="font-semibold mb-3">Localization</h3>
          <select className="input" defaultValue="en" onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="ru">Русский</option>
            <option value="uz">O'zbek</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-semibold mb-3">Module Controls (Real-time toggles)</h3>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          {Object.entries(modules).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between border rounded p-2">
              <span>{key}</span>
              <input type="checkbox" checked={value} onChange={(e) => setModules({ ...modules, [key]: e.target.checked })} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
