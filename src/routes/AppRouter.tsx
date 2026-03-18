import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import UserLayout from '@/layouts/UserLayout/UserLayout';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import LoginAdmin from '@/pages/admin/LoginAdmin';
import AdminDashboard from '@/pages/admin/Dashboard';
import ProductsManagement from '@/pages/admin/Products';
import CatalogManagement from '@/pages/admin/Catalog';
import UsersManagement from '@/pages/admin/Users';
import ProfilePage from '@/pages/admin/Profile';
import AboutUser from '@/pages/user/About';
import HomeUser from '@/pages/user/Home';
import ProductPage from '@/pages/user/ProductPage';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

/** Redirects authenticated users away from the login page */
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    return isAuthenticated
        ? <Navigate to="/admin/dashboard" replace />
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
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<ProductsManagement />} />
                        <Route path="catalog" element={<CatalogManagement />} />
                        <Route path="users" element={<UsersManagement />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                {/* Public User Routes */}
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<HomeUser />} />
                    <Route path="home" element={<Navigate to="/" replace />} />
                    <Route path="about" element={<AboutUser />} />
                    <Route path="producto/:id" element={<ProductPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
