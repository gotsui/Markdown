"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const AuthButton: React.FC = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (session && session.user) {
        return (
            <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                    ようこそ、{session.user.name || session.user.email} さん！
                </span>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    ログアウト
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("github")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            GitHubでログイン
        </button>
    );
};

export default AuthButton;