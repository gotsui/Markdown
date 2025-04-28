import Link from "next/link";
import React from "react";

type ArticleCardProps = {
    article: {
        id: string;
        title: string;
        slug: string;
        description?: string;
        visibility: "PUBLIC" | "PRIVATE" | "DRAFT";
        createdAt: string;
    };
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            {article.description && <p className="text-gray-600">{article.description}</p>}
            <p className="text-sm text-gray-500">Created: {new Date(article.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Visibility: {article.visibility}</p>
        </div>
    );
};

export default ArticleCard;