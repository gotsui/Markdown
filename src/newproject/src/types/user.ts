type User = {
    id: string;
    name?: string;
    email: string;
    emailVerified?: string;
    image?: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
};