import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../features/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import SalesPage from '../features/sales/SalesPage';
import UsersPage from '../features/users/UsersPage';
import { useSelector } from 'react-redux';
import type { ReactNode } from 'react';

function AdminRoute({ children }: { children: ReactNode }) {
    const user = useSelector((s: any) => s.auth.user);
    if (user?.role !== 'ADMIN') return <div className="p-6">No autorizado</div>;
    return children;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute><App/></ProtectedRoute>,
        children: [
            { index: true, element: <SalesPage/> },
            { path: 'ventas', element: <SalesPage/> },
            { path: 'usuarios', element: <AdminRoute><UsersPage/></AdminRoute> },
        ]
    },
    { path: '/login', element: <Login/> },
]);