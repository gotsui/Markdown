"use client";

import { signIn } from "next-auth/react";

const SignIn = () => {
    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">ログイン</h1>
            <button
                onClick={() => signIn("github")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                GitHub でログイン
            </button>
        </div>
    );
};

export default SignIn;