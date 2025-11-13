type UserRole = "USER" | "ADMIN";

type User = {
    id: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | null;
    image?: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};