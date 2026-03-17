// Firestore Catalog Service
// Gestiona Supercategorías y Categorías desde Firebase Firestore.
// Las tallas se manejan de forma local (localStorage + constants).

import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    orderBy,
    type CollectionReference,
    type DocumentData,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Category, SuperCategory } from './catalog.types';

// ── Collection References ──────────────────────────────────────────────────

const superCategoriesRef = collection(db, 'supercategories') as CollectionReference<DocumentData>;
const categoriesRef      = collection(db, 'categories')      as CollectionReference<DocumentData>;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Maps a Firestore document snapshot to a typed object with its id */
const mapDoc = <T>(snapshot: DocumentData): T => ({
    id: snapshot.id,
    ...snapshot.data(),
}) as T;

// ══════════════════════════════════════════════════════════════════════════
// SUPERCATEGORIES
// ══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all supercategories ordered by name.
 */
export const getSuperCategories = async (): Promise<SuperCategory[]> => {
    const q = query(superCategoriesRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapDoc<SuperCategory>(d));
};

/**
 * Create a new supercategory.
 * Returns the newly created document's id.
 */
export const createSuperCategory = async (
    data: Omit<SuperCategory, 'id'>
): Promise<string> => {
    const docRef = await addDoc(superCategoriesRef, data);
    return docRef.id;
};

/**
 * Update an existing supercategory (partial update).
 */
export const updateSuperCategory = async (
    id: string,
    data: Partial<Omit<SuperCategory, 'id'>>
): Promise<void> => {
    const docRef = doc(db, 'supercategories', id);
    await updateDoc(docRef, data);
};

// ══════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all categories ordered by name.
 */
export const getCategories = async (): Promise<Category[]> => {
    const q = query(categoriesRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapDoc<Category>(d));
};

/**
 * Create a new category.
 * Returns the newly created document's id.
 */
export const createCategory = async (
    data: Omit<Category, 'id'>
): Promise<string> => {
    const docRef = await addDoc(categoriesRef, data);
    return docRef.id;
};

/**
 * Update an existing category (partial update).
 */
export const updateCategory = async (
    id: string,
    data: Partial<Omit<Category, 'id'>>
): Promise<void> => {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, data);
};
