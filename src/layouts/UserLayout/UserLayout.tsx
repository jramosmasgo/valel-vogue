import Footer from '@/components/user/Footer';
import Header from '@/components/user/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';
import './userLayout.scss';


const UserLayout: React.FC = () => {
    return (
        <div className='user-layout'>
            <Header />
            <div className="light-mode-pattern" />
            <div className="dark-mode-pattern" />
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default UserLayout