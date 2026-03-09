import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '@/services/authentication';
import type { AuthUser } from '@/services/authentication';

// ── Types ──────────────────────────────────────────────────────────────────

interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;   // true while Firebase resolves the initial session
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    // setUser is not exposed; state is driven only by Firebase callbacks
}

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true); // start true → waiting for Firebase

    useEffect(() => {
        // Subscribe to Firebase auth state changes.
        // Returns the unsubscribe function, which React calls on unmount.
        const unsubscribe = onAuthChange((firebaseUser) => {
            setUser(firebaseUser);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextValue = {
        user,
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

/**
 * Consume the AuthContext.
 * Must be used inside <AuthProvider>.
 *
 * @example
 * const { user, isAuthenticated, isLoading } = useAuth();
 */
export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
};
