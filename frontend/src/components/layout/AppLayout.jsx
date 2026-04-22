import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const nav = [
  ['Dashboard', '/'],
  ['CRM', '/crm'],
  ['LMS', '/lms'],
  ['HEMIS', '/hemis'],
  ['Payments', '/payments'],
  ['SMS Templates', '/sms-templates'],
  ['Notifications', '/notifications'],
  ['Settings', '/settings']
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeRole, roles } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
          <h1 className="text-xl font-bold mb-1">EduCore Admin</h1>
          <p className="text-xs mb-4 text-slate-300">Active role: {activeRole || 'N/A'}</p>
          <nav className="space-y-2">
            {nav.map(([label, path]) => (
              <Link className="block px-3 py-2 rounded hover:bg-slate-700" key={path} to={path}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 space-y-2">
            <button
              className="bg-slate-700 px-3 py-2 rounded w-full"
              onClick={() => {
                if ((roles || []).length > 1) navigate('/choose-role');
              }}
            >
              Switch Role
            </button>
            <button
              className="bg-red-600 px-3 py-2 rounded w-full"
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
