import * as Dialog from '@radix-ui/react-dialog';
import type React from 'react';
import type { Product } from '@/services/product/product.types';
import { X } from 'lucide-react';
import "./styleComponents.scss";

interface ProductDetailsProps {
    product: Product | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    if (!product) return null;

    const numero = "51988440617";
    const productUrl = `${window.location.origin}/og/${product.id}`;
    const mensaje = `Quiero tener mas informacion sobre: ${product.name}\n\n${productUrl}`;
    const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    return (
        <Dialog.Portal>
            <Dialog.Overlay className='product-detail-overlay'>
                <Dialog.Content className='product-detail-content'>
                    <img src={product.image || 'https://via.placeholder.com/300x400'} alt={product.name} className="product-detail-image" />
                    <div className="product-detail-info">
                        <Dialog.Title className='product-detail-title'>{product.name}</Dialog.Title>
                        <p className='product-detail-description'>{product.description}</p>

                        <div className='product-detail-colors'>
                            <span>Colores disponibles:</span>
                            <div className="colors-content">
                                {product.colors?.map((color, idx) => (
                                    <div key={idx} className="color-item">
                                        {color}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='product-detail-sizes'>
                            <span>Tallas disponibles:</span>
                            <div className="sizes-list">
                                {product.sizes?.map((size, idx) => (
                                    <p key={idx}>{size}</p>
                                ))}
                            </div>
                        </div>

                        <p className='product-detail-price'>S/. {product.price.toFixed(2)}</p>

                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className='product-detail-buy'>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.539 2.016 2.041-.54c.947.518 2.071.9 3.247.901 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.764-5.768-5.764zm3.37 8.202c-.121.332-.708.623-.974.664-.265.042-.511.054-1.464-.325-.953-.379-1.564-1.346-1.611-1.408-.047-.063-.388-.517-.388-.995 0-.478.249-.713.338-.813.088-.1.194-.125.258-.125s.129 0 .184.004c.058.003.136-.022.213.161.077.184.264.646.288.694.024.048.04.103.008.165s-.048.103-.097.158c-.05.054-.105.122-.15.163-.045.041-.1.082-.043.176.057.094.254.419.547.679.378.333.696.437.794.485.099.048.156.04.213-.024.057-.064.242-.284.306-.381.065-.097.129-.081.217-.048s.556.262.653.31c.097.048.161.073.185.113.024.04.024.232-.097.564z" />
                                <path d="M12.036 3c-4.933 0-8.932 4-8.932 8.932 0 1.8.533 3.474 1.455 4.881l-1.559 5.821 5.955-1.589c1.338.83 2.912 1.319 4.601 1.319 4.933 0 8.932-4 8.932-8.932s-3.999-8.932-8.932-8.932zm0 16.148c-1.536 0-3.038-.433-4.341-1.252l-.311-.19-3.23.861.874-3.264-.21-.334c-.878-1.393-1.341-3.016-1.341-4.706 0-4.529 3.684-8.213 8.213-8.213 4.529 0 8.213 3.684 8.213 8.213s-3.684 8.213-8.213 8.213z" />
                            </svg>
                            Comprar por WhatsApp
                        </a>
                    </div>
                    <Dialog.Close className='product-detail-closeButton'>
                        <X size={24} />
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Overlay>
        </Dialog.Portal>
    );
}

export default ProductDetails;