type UserRole = "USER" | "ADMIN";

type User = {
    id: string;
    name?: string;
    email: string;
    emailVerified?: string;
    image?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
};