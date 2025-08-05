import * as Dialog from '@radix-ui/react-dialog'
import type React from 'react'
import "./styleComponents.scss";
import { CasacaHombre } from '@/config/assets';
import { X } from 'lucide-react';

const ProductDetails: React.FC = () => {
    return (
        <Dialog.Portal>
            <Dialog.Overlay className='product-detail-overlay' >
                <Dialog.Content className='product-detail-content'>
                    <img src={CasacaHombre} alt="" className="product-detail-image" />
                    <div className="product-detail-info">
                        <Dialog.Title className='product-detail-title'> Casaca Oversized </Dialog.Title>
                        <p className='product-detail-description'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque numquam fuga excepturi quae tempora adipisci saepe voluptates </p>
                        <div className='product-detail-colors'>
                            <span>Colores disponibles:</span>
                            <div className="colors-content">
                                <div>Negro <div style={{ background: "black" }}></div>  </div>
                                <div>Blanco <div style={{ background: "white" }}></div>  </div>
                                <div>Rojo <div style={{ background: "red" }}></div>  </div>
                            </div>
                        </div>
                        <div className='product-detail-sizes'>
                            <span>Tallas disponibles:</span>
                            <p>M</p>
                            <p>S</p>
                            <p>L</p>
                        </div>
                        <p className='product-detail-price'>S/. 107.99</p>
                        <div className="product-detail-buttons">
                            <button className='product-detail-buy'>
                                <img height={30} src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/2048px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png" alt="" />
                                Comprar
                            </button>
                            <Dialog.Close className='product-detail-closeButton'>  <X size={35} /></Dialog.Close>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Overlay>
        </Dialog.Portal>
    )
}

export default ProductDetails