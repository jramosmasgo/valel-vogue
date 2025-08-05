import React, { useState } from 'react'
import './userComponents.scss'
import { WhiteLogoLetters } from '@/config/assets'
import { AlignJustify } from 'lucide-react';

const Header: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className='header'>
            <div className='header-logo'>
                <img src={WhiteLogoLetters} alt="" />
            </div>
            <nav className='header-menu hide-on-mobile' >
                <ul>
                    <li>Inicio</li>
                    <li>Nosotros</li>
                </ul>
            </nav>
            <div className='show-only-on-mobile' onClick={() => setShowMenu(!showMenu)}>
                <AlignJustify size={30} />
            </div>
            {
                <nav className={`header-menu-mobile ${showMenu ? 'header-menu-mobile-show' : ''}`}>
                    <ul>
                        <li>Inicio</li>
                        <li>Nosotros</li>
                    </ul>
                </nav>
            }
        </div>
    )
}

export default Header