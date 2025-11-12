import React from "react";
import Link from "next/link";

type ArticleCardProps = {
    article: Article;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="p-4 border rounded-lg shadow-md hover:bg-gray-100 overflow-hidden"
        >
            <div>
                <h2 className="text-xl font-semibold truncate" title={article.title}>
                    {article.title}
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                    作成者：{article.author.name || "匿名"}
                </p>
                <p className="text-sm text-gray-500">
                    作成日：{new Date(article.createdAt).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
                </p>
                <p className="text-sm text-gray-700">
                    お気に入り数：
                    <span className={`mx-1 ${article.isFavorited ? "text-red-500" : "text-gray-500"}`}>
                        {article.isFavorited ? "♥" : "♡"}
                    </span>
                    {article._count?.favorites || 0}
                </p>
            </div>
        </Link>
    );
};

export default ArticleCard;