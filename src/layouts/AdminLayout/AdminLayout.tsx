import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Menu, Layers } from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import "./adminLayout.scss";

export const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: ShoppingBag, label: 'Productos' },
        { path: '/admin/catalog', icon: Layers, label: 'Catálogo' },
        { path: '/admin/users', icon: Users, label: 'Usuarios' },
        { path: '/admin/settings', icon: Settings, label: 'Ajustes' },
    ];

    const getPageTitle = () => {
        const currentItem = menuItems.find(item => location.pathname === item.path);
        return currentItem ? currentItem.label : 'Panel de Control';
    };

    return (
        <div className='admin-dashboard'>
            {/* Sidebar toggle button (mobile only) */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <aside className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className='sidebar-logo'>VALEL ADMIN</div>

                <nav className='sidebar-menu'>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    <NavLink to="/admin/login" className="menu-item mt-auto" style={{ marginTop: 'auto' }}>
                        <LogOut />
                        <span>Cerrar Sesión</span>
                    </NavLink>
                </nav>
            </aside>

            <main className='admin-main'>
                <header className='admin-header'>
                    <div className='header-left' style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            className='show-only-on-mobile'
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} color="#111" />
                        </button>
                        <h2 className='header-title'>{getPageTitle()}</h2>
                    </div>

                    <div className='user-info'>
                        <div className='user-text' style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                            <span className='user-name'>Admin Valel</span>
                        </div>
                        <div className='user-avatar'>AV</div>
                    </div>
                </header>

                <section className='admin-content'>
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

