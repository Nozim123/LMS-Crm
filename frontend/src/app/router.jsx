import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CrmPage from '../pages/crm/CrmPage';
import LmsPage from '../pages/lms/LmsPage';
import HemisPage from '../pages/hemis/HemisPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import LoginPage from '../pages/auth/LoginPage';
import ChooseRolePage from '../pages/auth/ChooseRolePage';
import SMSTemplatesPage from '../pages/sms/SMSTemplatesPage';

function RequireAuth() {
  const { accessToken, activeRole, roles, hydrated } = useSelector((s) => s.auth);

  if (!hydrated) return <p>Loading session...</p>;
  if (!accessToken) return <Navigate to="/login" replace />;
  if (!activeRole && (roles || []).length > 1) return <Navigate to="/choose-role" replace />;
  if (!activeRole && !(roles || []).length) return <p>Loading role...</p>;

  return <Outlet />;
}

function RequireSessionOnly() {
  const { accessToken } = useSelector((s) => s.auth);
  if (!accessToken) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireSessionOnly />,
    children: [{ path: '/choose-role', element: <ChooseRolePage /> }]
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'crm', element: <CrmPage /> },
          { path: 'lms', element: <LmsPage /> },
          { path: 'hemis', element: <HemisPage /> },
          { path: 'payments', element: <PaymentsPage /> },
          { path: 'sms-templates', element: <SMSTemplatesPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'settings', element: <SettingsPage /> }
        ]
      }
    ]
  }
]);
