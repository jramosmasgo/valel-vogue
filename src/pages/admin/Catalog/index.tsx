import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Tag, List, Maximize2 } from 'lucide-react';
import './styles.scss';
import catalogData from '@/data/catalog.json';
import {
    getSuperCategories,
    getCategories,
    createSuperCategory,
    updateSuperCategory,
    createCategory,
    updateCategory
} from '@/services/catalog/catalog.service';
import type {
    SuperCategory as ISuperCategory,
    Category as ICategory
} from '@/services/catalog/catalog.types';

interface Size {
    id: string | number;
    name: string;
    status: 'active' | 'inactive';
}

type TabType = 'supercategories' | 'categories' | 'sizes';

const STORAGE_KEY = 'valel_vogue_catalog';

const CatalogManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('supercategories');
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        superCategoryId: '',
        status: 'active' as 'active' | 'inactive',
        sizeType: 'letter' as 'letter' | 'number'
    });

    // Error state for validation feedback
    const [error, setError] = useState<string | null>(null);

    // Main States
    const [superCategories, setSuperCategories] = useState<ISuperCategory[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data from Firestore (Super/Categories) and LocalStorage (Sizes)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Firestore data
                const [fbSuper, fbCat] = await Promise.all([
                    getSuperCategories(),
                    getCategories()
                ]);
                setSuperCategories(fbSuper);
                setCategories(fbCat);

                // 2. Fetch LocalStorage data for Sizes
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setSizes(parsed.sizes || []);
                } else {
                    setSizes(catalogData.sizes as Size[]);
                }
            } catch (err) {
                console.error("Error fetching catalog data:", err);
                setError("Ocurrió un error al cargar los datos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Save only Sizes to LocalStorage (Categories/Super are in Firebase)
    const persistSizes = (newSize: Size[]) => {
        const currentSaved = localStorage.getItem(STORAGE_KEY);
        const parsed = currentSaved ? JSON.parse(currentSaved) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...parsed,
            sizes: newSize
        }));
    };

    const handleOpenModal = (item: any = null) => {
        setIsEditing(!!item);
        setSelectedItem(item);
        setError(null);
        if (item) {
            // Infer size type for existing items if in sizes tab
            let type: 'letter' | 'number' = 'letter';
            if (activeTab === 'sizes' && !isNaN(Number(item.name))) {
                type = 'number';
            }

            setFormData({
                name: item.name,
                superCategoryId: item.superCategoryId?.toString() || '',
                status: item.status,
                sizeType: type
            });
        } else {
            setFormData({
                name: '',
                superCategoryId: '',
                status: 'active',
                sizeType: 'letter'
            });
        }
        setModalOpen(true);
    };

    const handleSave = async () => {
        setError(null);
        let finalName = formData.name.trim();

        if (!finalName) {
            setError('El nombre no puede estar vacío');
            return;
        }

        if (activeTab === 'sizes') {
            if (formData.sizeType === 'number') {
                if (isNaN(Number(finalName))) {
                    setError('Debe ingresar un valor numérico');
                    return;
                }
            } else {
                finalName = finalName.toUpperCase();
            }

            const isDuplicate = sizes.some(s =>
                s.name.toLowerCase() === finalName.toLowerCase() &&
                (!isEditing || s.id !== selectedItem.id)
            );

            if (isDuplicate) {
                setError(`La talla "${finalName}" ya existe en el catálogo`);
                return;
            }
        }

        try {
            if (activeTab === 'supercategories') {
                if (isEditing) {
                    await updateSuperCategory(selectedItem.id.toString(), {
                        name: finalName,
                        status: formData.status
                    });
                    setSuperCategories(prev => prev.map(sc =>
                        sc.id === selectedItem.id ? { ...sc, name: finalName, status: formData.status } : sc
                    ));
                } else {
                    const newId = await createSuperCategory({ name: finalName, status: formData.status });
                    setSuperCategories(prev => [...prev, { id: newId, name: finalName, status: formData.status }]);
                }
            } else if (activeTab === 'categories') {
                if (isEditing) {
                    await updateCategory(selectedItem.id.toString(), {
                        name: finalName,
                        superCategoryId: formData.superCategoryId,
                        status: formData.status
                    });
                    setCategories(prev => prev.map(c =>
                        c.id === selectedItem.id ? { ...c, name: finalName, superCategoryId: formData.superCategoryId, status: formData.status } : c
                    ));
                } else {
                    const newId = await createCategory({
                        name: finalName,
                        superCategoryId: formData.superCategoryId,
                        status: formData.status
                    });
                    setCategories(prev => [...prev, { id: newId, name: finalName, superCategoryId: formData.superCategoryId, status: formData.status }]);
                }
            } else if (activeTab === 'sizes') {
                let updatedSizes;
                if (isEditing) {
                    updatedSizes = sizes.map(s => s.id === selectedItem.id ? { ...s, name: finalName, status: formData.status } : s);
                } else {
                    updatedSizes = [...sizes, { id: Date.now(), name: finalName, status: formData.status }];
                }
                setSizes(updatedSizes);
                persistSizes(updatedSizes);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error saving data:", err);
            setError("No se pudo guardar la información. Intente de nuevo.");
        }
    };

    const getSuperCategoryName = (id: number | string) => {
        return superCategories.find((sc: ISuperCategory) => sc.id.toString() === id.toString())?.name || 'N/A';
    };

    const renderSuperCategories = () => (
        <div className='catalog-table-container'>
            <div className='table-responsive'>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {superCategories.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>
                                    <span className={`badge ${item.status}`}>
                                        {item.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className='actions-cell'>
                                        <button className='btn-edit' title="Editar" onClick={() => handleOpenModal(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCategories = () => (
        <div className='catalog-table-container'>
            <div className='table-responsive'>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Supercategoría</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{getSuperCategoryName(item.superCategoryId)}</td>
                                <td>
                                    <span className={`badge ${item.status}`}>
                                        {item.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className='actions-cell'>
                                        <button className='btn-edit' title="Editar" onClick={() => handleOpenModal(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSizes = () => (
        <div className='catalog-table-container'>
            <div className='table-responsive'>
                <table>
                    <thead>
                        <tr>
                            <th>Talla / Medida</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizes.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>
                                    <span className={`badge ${item.status}`}>
                                        {item.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className='actions-cell'>
                                        <button className='btn-edit' title="Editar" onClick={() => handleOpenModal(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className='catalog-management'>
            <div className='catalog-header'>
                <div className='header-info'>
                    <h3>Configuración de Catálogo</h3>
                    <p>Administra las jerarquías y especificaciones de tus productos.</p>
                </div>
            </div>

            <div className='catalog-tabs'>
                <button
                    className={`tab-btn ${activeTab === 'supercategories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('supercategories')}
                >
                    <Maximize2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Supercategorías
                </button>
                <button
                    className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    <List size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Categorías
                </button>
                <button
                    className={`tab-btn ${activeTab === 'sizes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sizes')}
                >
                    <Tag size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Tallas
                </button>
            </div>

            <div className='tab-content'>
                <div className='content-header'>
                    <h4>
                        {activeTab === 'supercategories' && 'Gestionar Supercategorías'}
                        {activeTab === 'categories' && 'Gestionar Categorías'}
                        {activeTab === 'sizes' && 'Gestionar Tallas'}
                    </h4>
                    <button className='btn-add' onClick={() => handleOpenModal()}>
                        <Plus size={20} />
                        <span>Nuevo</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="loading-container">Cargando catálogo...</div>
                ) : (
                    <>
                        {activeTab === 'supercategories' && renderSuperCategories()}
                        {activeTab === 'categories' && renderCategories()}
                        {activeTab === 'sizes' && renderSizes()}
                    </>
                )}
            </div>

            {/* Modal for CRUD */}
            {isModalOpen && (
                <div className='admin-modal-overlay'>
                    <div className='admin-modal-content' style={{ maxWidth: '450px' }}>
                        <div className='modal-header'>
                            <h3>{isEditing ? 'Editar' : 'Crear'} {
                                activeTab === 'supercategories' ? 'Supercategoría' :
                                    activeTab === 'categories' ? 'Categoría' : 'Talla'
                            }</h3>
                            <button className='close-btn' onClick={() => setModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className='modal-body'>
                            {error && (
                                <div style={{
                                    background: '#fdecea',
                                    color: '#d32f2f',
                                    padding: '10px 15px',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    border: '1px solid rgba(211, 47, 47, 0.2)'
                                }}>
                                    {error}
                                </div>
                            )}
                            <div className='form-grid' style={{ gridTemplateColumns: '1fr' }}>
                                {activeTab === 'sizes' && (
                                    <div className='form-group'>
                                        <label className='form-label'>Tipo de Talla</label>
                                        <select
                                            className='form-input'
                                            value={formData.sizeType}
                                            onChange={(e) => setFormData({ ...formData, sizeType: e.target.value as 'letter' | 'number' })}
                                        >
                                            <option value="letter">Letra (XS, S, M...)</option>
                                            <option value="number">Numérica (26, 28, 30...)</option>
                                        </select>
                                    </div>
                                )}
                                <div className='form-group'>
                                    <label className='form-label'>
                                        {activeTab === 'sizes' ? (formData.sizeType === 'number' ? 'Valor Numérico' : 'Talla (Texto)') : 'Nombre'}
                                    </label>
                                    <input
                                        className='form-input'
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={activeTab === 'sizes' ? (formData.sizeType === 'number' ? 'Ej. 28' : 'Ej. XL') : 'Ej. Invierno, Jeans...'}
                                    />
                                </div>

                                {activeTab === 'categories' && (
                                    <div className='form-group'>
                                        <label className='form-label'>Supercategoría Padre</label>
                                        <select
                                            className='form-input'
                                            value={formData.superCategoryId}
                                            onChange={(e) => setFormData({ ...formData, superCategoryId: e.target.value })}
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {superCategories.map(sc => (
                                                <option key={sc.id} value={sc.id}>{sc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className='form-group'>
                                    <label className='form-label'>Estado</label>
                                    <select
                                        className='form-input'
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                    >
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='modal-footer'>
                            <button className='btn-cancel' onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className='btn-save' onClick={handleSave}>
                                {isEditing ? 'Guardar Cambios' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatalogManagement;
