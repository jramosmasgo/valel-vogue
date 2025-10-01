import React from 'react';
import './styles.scss';
import { BlackLogo } from '@/config/assets';

const LoginAdmin: React.FC = () => {
    return (
        <>
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
                <div className="login-content">

                    <form className='login-form' action="">
                        <h1>Inicio de Sesion</h1>
                        <input type="email" />
                        <input type="password" />
                        <div className="submit-button">
                            <button>Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginAdmin