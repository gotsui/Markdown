"use client";

import { useState } from "react";

import ArticleDownloadButton from "@/components/ArticleDownloadButton";
import EditButton from "@/components/EditButton";
import FavoriteButton from "@/components/FavoriteButton";
import MarkdownView from "@/components/markdown/MarkdownView";
import TableOfContents, { TocItem } from "@/components/TableOfContents";

type Favorite = {
    articleId: string;
    id: string;
    userId: string;
    createdAt: Date;
};

type Author = {
    image: string | null;
    id: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: Date | null;
    role: Role;
};

type Article = {
    title: string;
    slug: string;
    authorId: string;
    id: string;
    description: string | null;
    visibility: Visibility;
    createdAt: Date;
    updatedAt: Date;
};

type ArticleLayoutProps = {
    article: Article;
    author: Author;
    favorites?: Favorite[];
    count?: {
        author: number;
        favorites: number;
    };
    markdown: string;
    session: any;
};

const ArticleLayout = ({
    article,
    author,
    favorites,
    count,
    markdown,
    session,
}: ArticleLayoutProps) => {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);

    return (
        <div className="flex gap-12 justify-center">
            <div className="flex flex-col items-center space-y-4 h-fit sticky z-10 top-10 w-25">
                <EditButton slug={article.slug} authorId={article.authorId} session={session} />
                <ArticleDownloadButton slug={article.slug} />
                <FavoriteButton articleId={article.id} isInitialFavorited={favorites ? favorites.length > 0 : false} />
            </div>
            <div className="max-w-200 w-full py-4">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <p className="text-gray-600 mb-4">{article.description || "説明なし"}</p>
                <div className="text-sm text-gray-600 mb-8">
                    <p>作成者：{author.name || "匿名"}</p>
                    <p>作成日：{new Date(article.createdAt).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
                    <p>お気に入り数：{count?.favorites || 0}</p>
                    <p>公開状態：{article.visibility}</p>
                </div>
                <MarkdownView markdown={markdown} setTocItems={setTocItems} />
            </div>
            <div className="h-fit sticky z-10 top-7 max-h-[80vh] w-75 overflow-auto">
                <TableOfContents tocItems={tocItems} />
            </div>
        </div>
    );
};

export default ArticleLayout;