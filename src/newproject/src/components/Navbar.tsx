"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import React from "react";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link href="/">ドキュメント管理ツール</Link>
                </div>
                <div className="flex space-x-4 items-center">
                    <Link href="/articles" className="text-white hover:text-gray-300">
                        一覧
                    </Link>
                    <Link href="/articles/new" className="text-white hover:text-gray-300">
                        新規作成
                    </Link>
                    <Link href="/articles/upload" className="text-white hover:text-gray-300">
                        アップロード
                    </Link>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;