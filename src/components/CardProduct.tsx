import React from 'react';
import type { Product } from '@/services/product/product.types';
import './styleComponents.scss';

interface CardProductInterface {
    product: Product;
    onClick?: () => void;
}

const CardProduct: React.FC<CardProductInterface> = ({ product, onClick }) => {
    return (
        <div className="card-product" onClick={onClick}>
            <div className="card-product-image">
                <img src={product.image || 'https://via.placeholder.com/300x400'} alt={product.name} />
            </div>
            <div className="card-product-details">
                <h3>{product.name}</h3>
                <span>S/. {product.price.toFixed(2)}</span>
            </div>
        </div>
    )
}

export default CardProduct;