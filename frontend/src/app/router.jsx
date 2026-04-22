import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CrmPage from '../pages/crm/CrmPage';
import LmsPage from '../pages/lms/LmsPage';
import HemisPage from '../pages/hemis/HemisPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import SettingsPage from '../pages/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'crm', element: <CrmPage /> },
      { path: 'lms', element: <LmsPage /> },
      { path: 'hemis', element: <HemisPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
]);
