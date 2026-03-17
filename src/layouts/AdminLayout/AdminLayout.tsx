import { LayoutDashboard, ShoppingBag, Users, LogOut, Menu, Layers, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/services/authentication';
import "./adminLayout.scss";

export const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { userProfile } = useAuth();

    const avatarInitials = userProfile?.name
        ? userProfile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : 'AV';

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: ShoppingBag, label: 'Productos' },
        { path: '/admin/users', icon: Users, label: 'Usuarios' },
        { path: '/admin/catalog', icon: Layers, label: 'Ajustes' },

    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPageTitle = () => {
        const currentItem = menuItems.find(item => location.pathname === item.path);
        return currentItem ? currentItem.label : 'Panel de Control';
    };

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
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

                    <button onClick={handleLogout} className="menu-item mt-auto" style={{ marginTop: 'auto', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                        <LogOut />
                        <span>Cerrar Sesión</span>
                    </button>
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

                    <div className='user-menu-container' ref={userMenuRef}>
                        <div className='user-info' onClick={() => setUserMenuOpen(!isUserMenuOpen)}>
                            <div className='user-text' style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                <span className='user-name'>{userProfile?.name ?? 'Admin'}</span>
                            </div>
                            {userProfile?.profileImage ? (
                                <img
                                    src={userProfile.profileImage}
                                    alt={userProfile.name}
                                    style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover' }}
                                />
                            ) : (
                                <div className='user-avatar'>{avatarInitials}</div>
                            )}
                        </div>

                        {isUserMenuOpen && (
                            <div className='user-dropdown'>
                                <NavLink to="/admin/profile" className='dropdown-item' onClick={() => setUserMenuOpen(false)}>
                                    <User size={18} />
                                    <span>Mi Perfil</span>
                                </NavLink>
                                <hr />
                                <button className='dropdown-item logout' onClick={handleLogout}>
                                    <LogOut size={18} />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <section className='admin-content'>
                    <Outlet />
                </section>
            </main>
        </div>
    )
}


