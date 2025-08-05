import React from 'react';
import './userComponents.scss';

const Footer: React.FC = () => {
    return (
        <footer className='footer'>
            <p>&copy; {new Date().getFullYear()} Valel vogue. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;