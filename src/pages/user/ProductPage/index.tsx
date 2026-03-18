import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/services/product/product.service';
import type { Product } from '@/services/product/product.types';
import { ChevronLeft } from 'lucide-react';
import './styles.scss';

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="product-page-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-page-error">
                <h2>Producto no encontrado</h2>
                <Link to="/" className="back-link">Volver al inicio</Link>
            </div>
        );
    }

    const encodedMessage = encodeURIComponent(`Quiero tener mas informacion sobre: ${product.name}\n\n${window.location.origin}/producto/${product.id}`);
    const whatsappUrl = `https://wa.me/51988440617?text=${encodedMessage}`;

    return (
        <div className="product-page">
            <div className="product-page-container">
                <Link to="/" className="back-button">
                    <ChevronLeft size={20} />
                    Volver al catálogo
                </Link>

                <div className="product-layout">
                    <div className="product-image-section">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-info-section">
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-price">S/. {product.price.toFixed(2)}</p>
                        
                        <div className="product-description">
                            <h3>Descripción</h3>
                            <p>{product.description || 'Sin descripción disponible.'}</p>
                        </div>

                        {product.colors && product.colors.length > 0 && (
                            <div className="product-variants">
                                <h3>Colores disponibles</h3>
                                <div className="variants-list">
                                    {product.colors.map((color, i) => (
                                        <span key={i} className="variant-pill">{color}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="product-variants">
                                <h3>Tallas disponibles</h3>
                                <div className="variants-list">
                                    {product.sizes.map((size, i) => (
                                        <span key={i} className="variant-pill size">{size}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="buy-button">
                            Comprar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
