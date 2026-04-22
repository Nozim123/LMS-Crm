import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CrmPage from '../pages/crm/CrmPage';
import LmsPage from '../pages/lms/LmsPage';
import HemisPage from '../pages/hemis/HemisPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import LoginPage from '../pages/auth/LoginPage';

const hasSession = () => Boolean(localStorage.getItem('accessToken'));

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: hasSession() ? <AppLayout /> : <Navigate to="/login" replace />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'crm', element: <CrmPage /> },
      { path: 'lms', element: <LmsPage /> },
      { path: 'hemis', element: <HemisPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
]);
