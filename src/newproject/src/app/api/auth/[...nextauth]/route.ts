import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, user }: any) {
            if (session.user && user) {
                session.user.id = user.id;
                session.user.email = user.email;
                session.user.emailVerified = user.emailVerified;
                session.user.image = user.image;
                session.user.role = user.role;
                session.user.createdAt = user.createdAt.toISOString();
                session.user.updatedAt = user.updatedAt.toISOString();
            }

            return session;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };