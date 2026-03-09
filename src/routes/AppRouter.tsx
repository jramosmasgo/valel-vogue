import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import UserLayout from '@/layouts/UserLayout/UserLayout';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import LoginAdmin from '@/pages/admin/LoginAdmin';
import ProductsManagement from '@/pages/admin/Products';
import CatalogManagement from '@/pages/admin/Catalog';
import AboutUser from '@/pages/user/About';
import HomeUser from '@/pages/user/Home';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

/** Redirects authenticated users away from the login page */
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    return isAuthenticated
        ? <Navigate to="/admin/products" replace />
        : <>{children}</>;
};

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes — only accessible when NOT logged in */}
                <Route path="/admin" element={<AuthLayout />}>
                    <Route
                        path="login"
                        element={
                            <GuestRoute>
                                <LoginAdmin />
                            </GuestRoute>
                        }
                    />
                </Route>

                {/* Protected Admin Routes — only accessible when logged in */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="products" element={<ProductsManagement />} />
                        <Route path="catalog" element={<CatalogManagement />} />
                    </Route>
                </Route>

                {/* Public User Routes */}
                <Route path="/" element={<UserLayout />}>
                    <Route index path="home" element={<HomeUser />} />
                    <Route path="about" element={<AboutUser />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
