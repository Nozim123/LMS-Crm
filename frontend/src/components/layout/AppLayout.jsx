import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const nav = [
  ['Dashboard', '/'],
  ['CRM', '/crm'],
  ['LMS', '/lms'],
  ['HEMIS', '/hemis'],
  ['Payments', '/payments'],
  ['Notifications', '/notifications'],
  ['Settings', '/settings']
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
          <h1 className="text-xl font-bold mb-6">EduCore Admin</h1>
          <nav className="space-y-2">
            {nav.map(([label, path]) => (
              <Link className="block px-3 py-2 rounded hover:bg-slate-700" key={path} to={path}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            className="mt-6 bg-red-600 px-3 py-2 rounded w-full"
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
          >
            Logout
          </button>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
