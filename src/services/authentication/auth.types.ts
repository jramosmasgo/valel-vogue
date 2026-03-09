// Authentication types shared across auth services
export interface AuthCredentials {
    email: string;
    password: string;
}

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}
