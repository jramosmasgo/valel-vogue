import { CasacaHombre } from '@/config/assets'
import React from 'react'
import './styleComponents.scss'

interface CardProductInterface {
    onClick?: () => void;
}

const CardProduct: React.FC<CardProductInterface> = ({ onClick }) => {
    return (
        <div className="card-product" onClick={onClick}>
            <div className="card-product-image">
                <img src={CasacaHombre} alt="" />
            </div>
            <div className="card-product-details">
                <h3>Casaca Cheroque</h3>
                <span>S/. 20.90</span>
            </div>
        </div>
    )
}

export default CardProduct