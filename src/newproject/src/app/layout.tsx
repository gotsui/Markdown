import type { Metadata } from "next";
import NextAuthProvider from "@/providers/NextAuth";
import NavBar from "@/components/Navbar";
import "../styles/globals.css";

export const metadata: Metadata = {
    title: "Markdown Editor",
    description: "GFM and Mermaid supported Markdown editor",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body>
                <NextAuthProvider>
                    <div className="flex flex-col h-screen">
                        <NavBar />
                        <main className="flex-1 basis-0 flex flex-col overflow-auto">{children}</main>
                    </div>
                </NextAuthProvider>
            </body>
        </html>
    );
}