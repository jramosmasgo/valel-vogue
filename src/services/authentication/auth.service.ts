// Firebase Authentication service
// All auth operations go through this file — import from here, not from firebase/auth directly.

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile,
    type User,
    type UserCredential,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import type { AuthCredentials, AuthUser } from './auth.types';

// ── helpers ────────────────────────────────────────────────────────────────

/** Maps a Firebase User object to the leaner AuthUser shape */
const mapUser = (user: User): AuthUser => ({
    uid:           user.uid,
    email:         user.email,
    displayName:   user.displayName,
    photoURL:      user.photoURL,
    emailVerified: user.emailVerified,
});

// ── auth operations ────────────────────────────────────────────────────────

/**
 * Sign in an existing user with email + password.
 * Returns a lean AuthUser on success; throws on failure.
 */
export const loginWithEmail = async (
    credentials: AuthCredentials
): Promise<AuthUser> => {
    const result: UserCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
    );
    return mapUser(result.user);
};

/**
 * Register a new user with email + password.
 * Optionally sets a display name right after creation.
 */
export const registerWithEmail = async (
    credentials: AuthCredentials,
    displayName?: string
): Promise<AuthUser> => {
    const result: UserCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
    );

    if (displayName) {
        await updateProfile(result.user, { displayName });
    }

    return mapUser(result.user);
};

/**
 * Sign out the current user.
 */
export const logout = async (): Promise<void> => {
    await signOut(auth);
};

/**
 * Send a password-reset email to the given address.
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};

/**
 * Subscribe to auth state changes.
 * Returns the unsubscribe function — call it on component unmount.
 *
 * @example
 * useEffect(() => {
 *   const unsub = onAuthChange((user) => setUser(user));
 *   return unsub;
 * }, []);
 */
export const onAuthChange = (
    callback: (user: AuthUser | null) => void
): (() => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
        callback(firebaseUser ? mapUser(firebaseUser) : null);
    });
};

/** Returns the current user synchronously (null if not signed in). */
export const getCurrentUser = (): AuthUser | null => {
    const user = auth.currentUser;
    return user ? mapUser(user) : null;
};
