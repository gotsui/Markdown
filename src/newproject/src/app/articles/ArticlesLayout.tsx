"use client";

import { useState } from "react";

import ArticleCard from "@/components/ArticleCard";
import FilterForm from "@/components/FilterForm";

type ArticlesLayoutProps = {
    userId: string;
    filters: ArticleFilter;
    articles: Article[];
};

const ArticlesLayout = ({
    userId,
    filters,
    articles,
}: ArticlesLayoutProps) => {
    const [isGrid, setIsGrid] = useState(true);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ドキュメント一覧</h1>
            <FilterForm isSignedIn={userId !== null} currentFilters={filters} />
            {articles.length === 0 ? (
                <p>ドキュメントがありません。</p>
            ) : (
                <div className="space-y-4">
                    <div className="inline-flex rounded-lg outline outline-gray-800 overflow-hidden">
                        <button
                            className={[
                                "p-1 cursor-pointer",
                                `${isGrid ? "bg-violet-500" : "bg-gray-200 hover:bg-gray-300"}`,
                            ].join(" ")}
                            onClick={() => setIsGrid(true)}
                        >
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clipRule="evenodd"/>
                            </svg>
                        </button>
                        <button
                            className={[
                                "p-1 cursor-pointer",
                                `${isGrid ? "bg-gray-200 hover:bg-gray-300" : "bg-violet-500"}`,
                            ].join(" ")}
                            onClick={() => setIsGrid(false)}
                        >
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
                            </svg>
                        </button>
                    </div>
                    <div
                        className={[
                            "grid grid-cols-1 gap-4",
                            `${isGrid && "md:grid-cols-3"}`,
                        ].join(" ")}
                    >
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

export default ArticlesLayout;