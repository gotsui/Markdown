"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const NextAuthProvider = ({ children }: { children: ReactNode}) => {
    // const session = await getServerSession(authOptions);
    {/* <SessionProvider session={session} refetchOnWindowFocus={false}> */}
    return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;