import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

type ArticleCardProps = {
    article: {
        id: string;
        title: string;
        slug: string;
        description?: string;
        visibility: "PUBLIC" | "PRIVATE" | "DRAFT";
        authorId: string;
        createdAt: string;
    };
    session: Session | null;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, session }) => {
    return (
        <div className="border px-4 pt-3 pb-4 rounded-lg shadow-md flex justify-between">
            <div>
                <h2 className="text-xl font-bold">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h2>
                {article.description && <p className="text-gray-600">{article.description}</p>}
                <p className="text-sm text-gray-500">Created: {new Date(article.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Visibility: {article.visibility}</p>
            </div>
            {session?.user && (session.user.id === article.authorId || session.user.role === "ADMIN") && (
                <div className="flex items-end">
                    <Link
                        href={`/articles/edit/${article.slug}`}
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        編集
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ArticleCard;