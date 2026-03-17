import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import "./styles.scss";
import CardProduct from '@/components/CardProduct';
import ProductDetails from '@/components/ProductDetails';

import { getProducts, incrementProductViews } from '@/services/product/product.service';
import { getCategories, getSuperCategories } from '@/services/catalog/catalog.service';
import type { Product } from '@/services/product/product.types';
import type { Category, SuperCategory } from '@/services/catalog/catalog.types';

const HomeUser: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [superCategories, setSuperCategories] = useState<SuperCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedSuperCategory, setSelectedSuperCategory] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const loadCatalogData = async () => {
            try {
                const [prods, cats, superCats] = await Promise.all([
                    getProducts(),
                    getCategories(),
                    getSuperCategories()
                ]);

                // Only keep available products
                setProducts(prods.filter(p => p.available !== false));
                // Handle different status formats or undefined
                setCategories(cats.filter(c => c.status !== false && c.status !== 'inactive'));
                setSuperCategories(superCats.filter(sc => sc.status !== false && sc.status !== 'inactive'));
            } catch (error) {
                console.error("Error loading source data:", error);
            }
        };

        loadCatalogData();
    }, []);

    // Derived filtered products
    const filteredProducts = products.filter(product => {
        const matchesSuper = selectedSuperCategory === 'all' || product.supercategory.id === selectedSuperCategory;
        const matchesCat = selectedCategory === 'all' || product.category.id === selectedCategory;
        return matchesSuper && matchesCat;
    });

    // Derived visible categories based on products that belong to the selected supercategory
    const availableCategoryIds = new Set(
        products
            .filter(p => selectedSuperCategory === 'all' || p.supercategory.id === selectedSuperCategory)
            .map(p => p.category.id)
    );

    const visibleCategories = categories.filter(c => {
        if (selectedSuperCategory === 'all') return true;
        return availableCategoryIds.has(c.id);
    });

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setOpenModal(true);

        // Increment views in Firestore in background
        incrementProductViews(product.id).catch(err => {
            console.error("Failed to increment view count", err);
        });
    };

    return (
        <div className='home-user'>
            <div className='home-user-navigation'>
                <button
                    className={selectedSuperCategory === 'all' ? 'nav-active' : ''}
                    onClick={() => { setSelectedSuperCategory('all'); setSelectedCategory('all'); }}
                >
                    Todos
                </button>
                {superCategories.map(sc => (
                    <button
                        key={sc.id}
                        className={selectedSuperCategory === sc.id ? 'nav-active' : ''}
                        onClick={() => { setSelectedSuperCategory(String(sc.id)); setSelectedCategory('all'); }}
                    >
                        {sc.name}
                    </button>
                ))}
            </div>

            <div className='home-user-categories'>
                <button
                    className={selectedCategory === 'all' ? 'category-active' : ''}
                    onClick={() => setSelectedCategory('all')}
                >
                    Todos
                </button>
                {visibleCategories.map(cat => (
                    <button
                        key={cat.id}
                        className={selectedCategory === cat.id ? 'category-active' : ''}
                        onClick={() => setSelectedCategory(String(cat.id))}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className='product-grid'>
                {filteredProducts.map(product => (
                    <CardProduct
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product)}
                    />
                ))}

                {filteredProducts.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
                        No se encontraron prendas para esta categoría.
                    </div>
                )}
            </div>

            {/* Pagination UI - Placeholder for now unless we do actual windowing */}
            {filteredProducts.length > 0 && (
                <div className='home-user-pagination'>
                    <button className='page-active'>1</button>
                </div>
            )}

            <Dialog.Root open={openModal} onOpenChange={setOpenModal}>
                <ProductDetails product={selectedProduct} />
            </Dialog.Root>
        </div>
    );
}

export default HomeUser;