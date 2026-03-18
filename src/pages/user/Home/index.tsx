import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    const [isLoading, setIsLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedSuperCategory, setSelectedSuperCategory] = useState<string>(searchParams.get('superCategory') || searchParams.get('supercategory') || 'all');
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');

    useEffect(() => {
        const sc = searchParams.get('superCategory') || searchParams.get('supercategory') || 'all';
        const cat = searchParams.get('category') || 'all';
        setSelectedSuperCategory(sc);
        setSelectedCategory(cat);
    }, [searchParams]);

    const handleSuperCategoryChange = (sc: string) => {
        setSelectedSuperCategory(sc);
        setSelectedCategory('all');
        const newParams = new URLSearchParams(searchParams);
        if (sc === 'all') {
            newParams.delete('superCategory');
            newParams.delete('supercategory');
        } else {
            newParams.set('superCategory', sc);
            newParams.delete('supercategory');
        }
        newParams.delete('category');
        setSearchParams(newParams);
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        const newParams = new URLSearchParams(searchParams);
        if (cat === 'all') {
            newParams.delete('category');
        } else {
            newParams.set('category', cat);
        }
        setSearchParams(newParams);
    };

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const loadCatalogData = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
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
                    onClick={() => handleSuperCategoryChange('all')}
                >
                    Todos
                </button>
                {superCategories.map(sc => (
                    <button
                        key={sc.id}
                        className={selectedSuperCategory === sc.id ? 'nav-active' : ''}
                        onClick={() => handleSuperCategoryChange(String(sc.id))}
                    >
                        {sc.name}
                    </button>
                ))}
            </div>

            <div className='home-user-categories'>
                <button
                    className={selectedCategory === 'all' ? 'category-active' : ''}
                    onClick={() => handleCategoryChange('all')}
                >
                    Todos
                </button>
                {visibleCategories.map(cat => (
                    <button
                        key={cat.id}
                        className={selectedCategory === cat.id ? 'category-active' : ''}
                        onClick={() => handleCategoryChange(String(cat.id))}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className='product-grid'>
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className='product-skeleton'>
                            <div className='skeleton-image'></div>
                            <div className='skeleton-info'></div>
                        </div>
                    ))
                ) : (
                    <>
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
                    </>
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