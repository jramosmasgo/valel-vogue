import React, { useState } from 'react';
import { Plus, Edit2, Power, Trash2, X, Upload } from 'lucide-react';
import './styles.scss';
import { CasacaHombre } from '@/config/assets';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
}

const ProductsManagement: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Mock initial data
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Casaca Cheroque', category: 'Casacas', price: 107.90, stock: 15, status: 'active' },
        { id: 2, name: 'Pantalón Slim Fit', category: 'Pantalones', price: 89.90, stock: 22, status: 'active' },
        { id: 3, name: 'Polo Oversized Black', category: 'Polos', price: 45.00, stock: 30, status: 'active' },
        { id: 4, name: 'Casaca Denim Vintage', category: 'Casacas', price: 129.90, stock: 8, status: 'inactive' },
        { id: 5, name: 'Chompa Lana Beige', category: 'Chompas', price: 75.00, stock: 12, status: 'active' },
        { id: 6, name: 'Falda Plisada', category: 'Faldas', price: 59.90, stock: 5, status: 'inactive' },
    ]);

    const handleToggleStatus = (id: number) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
        ));
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setSelectedProduct(null);
        setModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setIsEditing(true);
        setSelectedProduct(product);
        setModalOpen(true);
    };

    return (
        <div className='products-management'>
            <div className='products-header'>
                <div className='header-info'>
                    <h3>Gestión de Inventario</h3>
                    <p>Crea, actualiza y controla el catálogo de ropa de Valel Vogue.</p>
                </div>
                <button className='btn-add' onClick={openCreateModal}>
                    <Plus size={20} />
                    <span>Nueva Prenda</span>
                </button>
            </div>

            <div className='products-table-container'>
                <div className='table-responsive'>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td data-label="Producto">
                                        <div className='product-cell'>
                                            <img src={CasacaHombre} alt={product.name} />
                                            <div>
                                                <span className='name'>{product.name}</span>
                                                <span className='category'>{product.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Precio">
                                        <span style={{ fontWeight: 800 }}>S/. {product.price.toFixed(2)}</span>
                                    </td>
                                    <td data-label="Stock">{product.stock} unids.</td>
                                    <td data-label="Estado">
                                        <span className={`badge ${product.status}`}>
                                            {product.status === 'active' ? 'En venta' : 'Pausado'}
                                        </span>
                                    </td>
                                    <td className="actions-cell-td" data-label="Operaciones">
                                        <div className='actions-cell'>
                                            <button className='btn-edit' title='Editar' onClick={() => openEditModal(product)}>
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className='btn-toggle'
                                                title={product.status === 'active' ? 'Desactivar' : 'Activar'}
                                                onClick={() => handleToggleStatus(product.id)}
                                            >
                                                <Power size={18} />
                                            </button>
                                            <button className='btn-delete' title='Eliminar' onClick={() => handleDelete(product.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating / Editing */}
            {isModalOpen && (
                <div className='admin-modal-overlay'>
                    <div className='admin-modal-content'>
                        <div className='modal-header'>
                            <h3>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button className='close-btn' onClick={() => setModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className='modal-body'>
                            <form className='contact-form' style={{ background: 'transparent', padding: 0, boxShadow: 'none', border: 'none', maxWidth: 'none' }}>
                                <div className='form-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                                        <label className='form-label'>Nombre de la Prenda</label>
                                        <input className='form-input' defaultValue={selectedProduct?.name || ''} placeholder="Ej. Casaca Denim" />
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Categoría</label>
                                        <select className='form-input' defaultValue={selectedProduct?.category || 'Casacas'}>
                                            <option>Casacas</option>
                                            <option>Pantalones</option>
                                            <option>Polos</option>
                                            <option>Chompas</option>
                                            <option>Faldas</option>
                                        </select>
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Precio (S/.)</label>
                                        <input className='form-input' type='number' defaultValue={selectedProduct?.price || ''} placeholder="0.00" />
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Stock Inicial</label>
                                        <input className='form-input' type='number' defaultValue={selectedProduct?.stock || ''} placeholder="0" />
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Subir Imagen</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type='button' className='form-input' style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <Upload size={18} /> Subir
                                            </button>
                                        </div>
                                    </div>

                                    <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                                        <label className='form-label'>Descripción</label>
                                        <textarea className='form-textarea' placeholder='Información detallada sobre la tela, el ajuste, etc.'></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button className='btn-cancel' onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className='btn-save' onClick={() => setModalOpen(false)}>
                                {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsManagement;
