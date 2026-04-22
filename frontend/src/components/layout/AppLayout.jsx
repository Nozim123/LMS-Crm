import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const nav = [
  ['Dashboard', '/'],
  ['LMS Courses', '/lms'],
  ['CRM', '/crm'],
  ['HEMIS', '/hemis'],
  ['Payments', '/payments'],
  ['SMS Templates', '/sms-templates'],
  ['Notifications', '/notifications'],
  ['Admin Settings', '/settings']
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole, roles, user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-white border-r border-slate-200 p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="h-9 w-9 rounded-full bg-blue-600" />
            <div>
              <p className="font-bold text-lg leading-none">MY.HEMIS.UZ</p>
              <p className="text-xs text-slate-500">EduCore Admin</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {nav.map(([label, path]) => {
              const active = location.pathname === path;
              return (
                <Link key={path} className={`sidebar-link ${active ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`} to={path}>
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t pt-4 space-y-2">
            <button className="w-full border border-slate-300 rounded-md py-2 text-sm" onClick={() => (roles || []).length > 1 && navigate('/choose-role')}>
              Switch Role
            </button>
            <button
              className="w-full border border-red-200 text-red-600 rounded-md py-2 text-sm"
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Asosiy / Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">{activeRole || 'No role'}</span>
              <div className="h-9 w-9 rounded-full bg-slate-200" />
              <div className="text-sm">{user?.email || 'admin'}</div>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
