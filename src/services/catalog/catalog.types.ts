// Catalog types shared across catalog services

export interface SuperCategory {
    id: string;
    name: string;
    status: boolean | string;
}

export interface Category {
    id: string;
    name: string;
    superCategoryId?: string;
    status: boolean | string;
}
