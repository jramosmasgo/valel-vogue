import React from 'react'
import Header from '@/components/user/Header'
import './userLayout.scss';
import { BlackLogo } from '@/config/assets';
import HomeUser from '@/pages/user/Home';
import Footer from '@/components/user/Footer';

const UserLayout: React.FC = () => {
    return (
        <div
            className='user-layout'>
            <Header />
            <div
                style={{
                    position: 'absolute',
                    top: '100px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${BlackLogo})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '300px',
                    opacity: 0.1,
                    zIndex: -1,
                    pointerEvents: 'none',
                }}
            />
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
                <HomeUser />
            </div>
            <Footer />
        </div>
    )
}

export default UserLayout