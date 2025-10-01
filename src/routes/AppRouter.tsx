import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import UserLayout from '@/layouts/UserLayout/UserLayout';
import LoginAdmin from '@/pages/admin/LoginAdmin';
import AboutUser from '@/pages/user/About';
import HomeUser from '@/pages/user/Home';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/admin' element={<AdminLayout />}  >
                    <Route path='login' element={<LoginAdmin />} />
                </Route>
                <Route path='/' element={<UserLayout />}  >
                    <Route index path='home' element={<HomeUser />} ></Route>
                    <Route path='about' element={<AboutUser />} ></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter