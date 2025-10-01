import React from 'react';
import { Outlet } from 'react-router-dom';
import "./adminLayout.scss";

export const AdminLayout: React.FC = () => {
    return (
        <div className='admin-layout'>
            <Outlet />
        </div>
    )
}
