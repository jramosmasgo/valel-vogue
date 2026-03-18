import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    increment,
    type CollectionReference,
    type DocumentData,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Product, ProductInput } from './product.types';

const productsRef = collection(db, 'products') as CollectionReference<DocumentData>;

const mapDoc = <T>(snapshot: DocumentData): T => ({
    id: snapshot.id,
    ...snapshot.data(),
}) as T;

export const getProducts = async (): Promise<Product[]> => {
    const q = query(productsRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapDoc<Product>(d));
};

export const createProduct = async (data: ProductInput): Promise<string> => {
    const docRef = await addDoc(productsRef, data);
    return docRef.id;
};

export const updateProduct = async (
    id: string,
    data: Partial<ProductInput>
): Promise<void> => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, data);
};

export const deleteProduct = async (id: string): Promise<void> => {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
};

export const incrementProductViews = async (id: string): Promise<void> => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
        views: increment(1)
    });
};

export const getProductById = async (id: string): Promise<Product | null> => {
    const docRef = doc(db, 'products', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return {
        id: snapshot.id,
        ...snapshot.data()
    } as Product;
};
