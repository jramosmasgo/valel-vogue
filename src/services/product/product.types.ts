import { DocumentReference } from 'firebase/firestore';

export interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    colors: string[];
    sizes: string[];
    available: boolean;
    category: DocumentReference;
    supercategory: DocumentReference;
    price: number;
    views: number;
}

export type ProductInput = Omit<Product, 'id'>;
