import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Wraps protected routes.
 * - While Firebase resolves the session → shows nothing (or a spinner).
 * - If authenticated → renders the child routes via <Outlet />.
 * - If not authenticated → redirects to /admin/login.
 *
 * Usage in AppRouter:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="products" element={<ProductsManagement />} />
 *   </Route>
 */
const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontSize: '1rem',
                color: 'var(--color-text-muted)',
            }}>
                <span className="loader" style={{
                    width: 32,
                    height: 32,
                    border: '3px solid var(--color-border)',
                    borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.9s linear infinite',
                }} />
            </div>
        );
    }

    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
