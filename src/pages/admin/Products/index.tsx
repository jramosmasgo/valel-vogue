import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Power, Trash2, X } from 'lucide-react';
import './styles.scss';

import { doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

import type { Product, ProductInput } from '@/services/product/product.types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/product/product.service';
import type { Category, SuperCategory } from '@/services/catalog/catalog.types';
import { getCategories, getSuperCategories } from '@/services/catalog/catalog.service';
import { uploadImage } from '@/services/cloudinary.service';
import catalogData from '@/data/catalog.json';

const ProductsManagement: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [superCategories, setSuperCategories] = useState<SuperCategory[]>([]);

    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSuperCategory, setFilterSuperCategory] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [prods, cats, superCats] = await Promise.all([
                getProducts(),
                getCategories(),
                getSuperCategories()
            ]);
            setProducts(prods);
            setCategories(cats);
            setSuperCategories(superCats);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error al cargar la información.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === '' || product.category.id === filterCategory;
        const matchesSuperCategory = filterSuperCategory === '' || product.supercategory.id === filterSuperCategory;
        return matchesName && matchesCategory && matchesSuperCategory;
    });

    const handleToggleStatus = async (product: Product) => {
        try {
            await updateProduct(product.id, { available: !product.available });
            loadData();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Error al actualizar el estado.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await deleteProduct(id);
                loadData();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error al eliminar producto.');
            }
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setSelectedProduct(null);
        setImageFile(null);
        setModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setIsEditing(true);
        setSelectedProduct(product);
        setImageFile(null);
        setModalOpen(true);
    };

    const getCategoryName = (catRef: any) => {
        if (!catRef) return 'Sin categoría';
        const cat = categories.find(c => c.id === catRef.id);
        return cat ? cat.name : 'Categoría desconocida';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const categoryId = formData.get('category') as string;
        const supercategoryId = formData.get('supercategory') as string;
        const price = parseFloat(formData.get('price') as string) || 0;
        const description = formData.get('description') as string;
        const colors = (formData.get('colors') as string).split(',').map(c => c.trim()).filter(Boolean);
        const sizes = formData.getAll('sizes') as string[];

        if (!categoryId || !supercategoryId) {
            alert('Debes seleccionar categoría y supercategoría.');
            setIsLoading(false);
            return;
        }

        try {
            let imageUrl = selectedProduct?.image || '';
            if (imageFile) {
                const uploadRes = await uploadImage(imageFile);
                imageUrl = uploadRes.secure_url;
            }

            if (!imageUrl && !isEditing) {
                alert('Debes subir una imagen.');
                setIsLoading(false);
                return;
            }

            const payload: ProductInput = {
                name,
                category: doc(db, 'categories', categoryId),
                supercategory: doc(db, 'supercategories', supercategoryId),
                price,
                description,
                colors,
                sizes,
                views: isEditing ? (selectedProduct!.views || 1) : 1,
                image: imageUrl,
                available: isEditing ? selectedProduct!.available : true,
            };

            if (isEditing && selectedProduct) {
                await updateProduct(selectedProduct.id, payload);
            } else {
                await createProduct(payload);
            }

            await loadData();
            setModalOpen(false);
        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert('Ocurrió un error al guardar el producto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='products-management'>
            <div className='products-header'>
                <div className='header-info'>
                    <h3>Gestión de Inventario</h3>
                    <p>Crea, actualiza y controla el catálogo de ropa de Valel Vogue.</p>
                </div>
                <button className='btn-add' onClick={openCreateModal} disabled={isLoading}>
                    <Plus size={20} />
                    <span>Nueva Prenda</span>
                </button>
            </div>

            <div className='products-filters'>
                <input
                    type='text'
                    placeholder='Buscar por nombre...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='filter-input'
                />
                <select
                    value={filterSuperCategory}
                    onChange={(e) => setFilterSuperCategory(e.target.value)}
                    className='filter-select'
                >
                    <option value="">Todas las Supercategorías</option>
                    {superCategories.map(sc => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                    ))}
                </select>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className='filter-select'
                >
                    <option value="">Todas las Categorías</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className='products-table-container'>
                {isLoading && products.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando productos...</div>
                ) : (
                    <div className='table-responsive'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Vistas</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td data-label="Producto">
                                            <div className='product-cell'>
                                                <img src={product.image || 'https://via.placeholder.com/65x85'} alt={product.name} />
                                                <div>
                                                    <span className='name'>{product.name}</span>
                                                    <span className='category'>{getCategoryName(product.category)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Precio">
                                            <span style={{ fontWeight: 800 }}>S/. {(product.price || 0).toFixed(2)}</span>
                                        </td>
                                        <td data-label="Vistas">{product.views || 0}</td>
                                        <td data-label="Estado">
                                            <span className={`badge ${product.available ? 'active' : 'inactive'}`}>
                                                {product.available ? 'En venta' : 'Pausado'}
                                            </span>
                                        </td>
                                        <td className="actions-cell-td" data-label="Operaciones">
                                            <div className='actions-cell'>
                                                <button className='btn-edit' title='Editar' onClick={() => openEditModal(product)} disabled={isLoading}>
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className='btn-toggle'
                                                    title={product.available ? 'Desactivar' : 'Activar'}
                                                    onClick={() => handleToggleStatus(product)}
                                                    disabled={isLoading}
                                                >
                                                    <Power size={18} />
                                                </button>
                                                <button className='btn-delete' title='Eliminar' onClick={() => handleDelete(product.id)} disabled={isLoading}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay productos que coincidan con la búsqueda.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
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
                            <form id="productForm" onSubmit={handleSubmit} className='contact-form' style={{ background: 'transparent', padding: 0, boxShadow: 'none', border: 'none', maxWidth: 'none' }}>
                                <div className='form-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                                        <label className='form-label'>Nombre de la Prenda</label>
                                        <input name="name" className='form-input' required defaultValue={selectedProduct?.name || ''} placeholder="Ej. Casaca Denim" />
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Supercategoría</label>
                                        <select name="supercategory" className='form-input' required defaultValue={selectedProduct?.supercategory?.id || ''}>
                                            <option value="" disabled>Seleccione...</option>
                                            {superCategories.map(sc => (
                                                <option key={sc.id} value={sc.id}>{sc.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Categoría</label>
                                        <select name="category" className='form-input' required defaultValue={selectedProduct?.category?.id || ''}>
                                            <option value="" disabled>Seleccione...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Precio (S/.)</label>
                                        <input name="price" className='form-input' type='number' step='0.01' defaultValue={selectedProduct?.price || ''} placeholder="0.00" />
                                    </div>

                                    <div className='form-group'>
                                        <label className='form-label'>Colores (separa por comas)</label>
                                        <input name="colors" className='form-input' defaultValue={selectedProduct?.colors?.join(', ') || ''} placeholder="Ej. rojo, azul, negro" />
                                    </div>

                                    <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                                        <label className='form-label'>Tallas</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                                            {catalogData.sizes.filter(s => s.status === 'active').map(size => (
                                                <label key={size.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', padding: '4px 8px', background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                                    <input
                                                        type="checkbox"
                                                        name="sizes"
                                                        value={size.name}
                                                        defaultChecked={selectedProduct?.sizes?.includes(size.name)}
                                                    />
                                                    {size.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                                        <label className='form-label'>Subir Imagen</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className='form-input' style={{ flex: 1 }} />
                                        </div>
                                        {selectedProduct?.image && !imageFile && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img src={selectedProduct.image} alt="Vista previa" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                    </div>

                                    <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                                        <label className='form-label'>Descripción</label>
                                        <textarea name="description" className='form-textarea' required defaultValue={selectedProduct?.description || ''} placeholder='Información detallada sobre la tela, el ajuste, etc.'></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button className='btn-cancel' onClick={() => setModalOpen(false)} disabled={isLoading}>Cancelar</button>
                            <button type="submit" form="productForm" className='btn-save' disabled={isLoading}>
                                {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsManagement;

