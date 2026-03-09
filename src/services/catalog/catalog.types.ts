// Catalog types shared across catalog services

export type ItemStatus = 'active' | 'inactive';

export interface SuperCategory {
    id: string;
    name: string;
    status: ItemStatus;
}

export interface Category {
    id: string;
    name: string;
    superCategoryId: string;
    status: ItemStatus;
}
