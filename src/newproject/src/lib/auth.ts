import { Session } from "next-auth";

export const isAuthorOrAdmin = (authorId: string, session: Session | null): boolean => {
    if (!session?.user) {
        return false;
    }

    return session.user.id === authorId || session.user.role === "ADMIN";
};