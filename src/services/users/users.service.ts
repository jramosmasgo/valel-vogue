import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    type CollectionReference,
    type DocumentData,
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signOut,
    getAuth,
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { db } from '@/config/firebase';
import type { User, CreateUserData, UpdateUserData } from './users.types';

// ── Collection Reference ───────────────────────────────────────────────────

const usersRef = collection(db, 'users') as CollectionReference<DocumentData>;

const mapDoc = <T>(snapshot: DocumentData): T => ({
    id: snapshot.id,
    ...snapshot.data(),
}) as T;

// ── Secondary Firebase App (para crear usuarios sin desloguear al admin) ───
// Firebase solo permite una app primaria por nombre, reutilizamos si ya existe.

const SECONDARY_APP_NAME = 'secondary-auth';

const getSecondaryAuth = () => {
    const existingApps = getApps().map(a => a.name);
    const secondaryApp = existingApps.includes(SECONDARY_APP_NAME)
        ? getApp(SECONDARY_APP_NAME)
        : initializeApp(
              {
                  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
                  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
                  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
              },
              SECONDARY_APP_NAME
          );
    return getAuth(secondaryApp);
};

// ══════════════════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════════════════

const DEFAULT_PASSWORD = 'Sistemas10!';

/** Fetch all users ordered by name */
export const getUsers = async (): Promise<User[]> => {
    const q = query(usersRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapDoc<User>(d));
};

/**
 * Create a new user:
 *  1. Registers the account in Firebase Authentication (secondary app)
 *     with email + default password, without displacing the admin session.
 *  2. Saves the profile document in Firestore using the Auth UID as the doc ID.
 */
export const createUser = async (data: CreateUserData): Promise<string> => {
    const secondaryAuth = getSecondaryAuth();

    // 1. Create in Auth
    const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        data.email,
        DEFAULT_PASSWORD
    );
    const uid = credential.user.uid;

    // 2. Sign out from secondary auth immediately (keep it clean)
    await signOut(secondaryAuth);

    // 3. Save profile in Firestore with uid as document id
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, data);

    return uid;
};

/** Update an existing user's Firestore profile */
export const updateUser = async (id: string, data: UpdateUserData): Promise<void> => {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, data);
};

/** Delete a user's Firestore profile */
export const deleteUser = async (id: string): Promise<void> => {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
};

