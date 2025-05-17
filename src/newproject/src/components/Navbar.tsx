"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import React from "react";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link href="/">Article App</Link>
                </div>
                <div className="flex space-x-4 items-center">
                    <Link href="/articles" className="text-white hover:text-gray-300">
                        Articles
                    </Link>
                    <Link href="/articles/new" className="text-white hover:text-gray-300">
                        New Article
                    </Link>
                    <Link href="/articles/upload" className="text-white hover:text-gray-300">
                        Upload
                    </Link>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;