import { User as PrismaUser } from '@prisma/client';
import { Session } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user?: {
            id: string;
            name?: string | null;
            email: string;
            emailVerified?: string | null;
            image?: string | null;
            role: PrismaUser['role'];
            createdAt: string;
            updatedAt: string;
        };
    }
}