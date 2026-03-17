import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '@/services/authentication';
import type { AuthUser } from '@/services/authentication';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { User as UserProfile } from '@/services/users/users.types';

// ── Constants ──────────────────────────────────────────────────────────────

const PROFILE_STORAGE_KEY = 'vv_user_profile';

// ── Types ──────────────────────────────────────────────────────────────────

interface AuthState {
    user: AuthUser | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState { }

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Helpers ────────────────────────────────────────────────────────────────

const readProfileFromStorage = (): UserProfile | null => {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
        return null;
    }
};

// ── Provider ───────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(readProfileFromStorage);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribeProfile: (() => void) | null = null;

        const unsubscribeAuth = onAuthChange((firebaseUser) => {
            setUser(firebaseUser);

            // Cancel any previous profile listener
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (firebaseUser && firebaseUser.email) {
                // Subscribe to profile changes in Firestore
                const q = query(
                    collection(db, 'users'),
                    where('email', '==', firebaseUser.email)
                );

                unsubscribeProfile = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        const profile = {
                            id: snapshot.docs[0].id,
                            ...snapshot.docs[0].data(),
                        } as UserProfile;
                        setUserProfile(profile);
                        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
                    } else {
                        setUserProfile(null);
                        localStorage.removeItem(PROFILE_STORAGE_KEY);
                    }
                    setIsLoading(false);
                }, (error) => {
                    console.error('Error fetching user profile:', error);
                    setIsLoading(false);
                });
            } else {
                setUserProfile(null);
                localStorage.removeItem(PROFILE_STORAGE_KEY);
                setIsLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    const value: AuthContextValue = {
        user,
        userProfile,
        isLoading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ── Hook ───────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};
