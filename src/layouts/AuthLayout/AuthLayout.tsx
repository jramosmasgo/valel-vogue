import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.scss';

const AuthLayout: React.FC = () => {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <main className="auth-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;
