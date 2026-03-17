export type UserType = 'admin' | 'user';

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    profileImage: string;
    status: boolean;
    type: UserType;
}

export type CreateUserData = Omit<User, 'id'>;
export type UpdateUserData = Partial<CreateUserData>;
