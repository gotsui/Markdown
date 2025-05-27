import { Session } from "next-auth";
import Link from "next/link";
import React from "react";
import EditButton from "./EditButton";
import FavoriteButton from "./FavoriteButton";

type ArticleCardProps = {
    article: Article;
    session: Session | null;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, session }) => {
    return (
        <Link href={`/articles/${article.slug}`}>
            <div className="border px-4 pt-3 pb-4 rounded-lg shadow-md flex justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                        {article.title}
                    </h2>
                    {article.description && <p className="text-gray-600">{article.description}</p>}
                    <p className="text-sm text-gray-500">作成日: {new Date(article.createdAt).toLocaleDateString("ja-JP")}</p>
                    <p className="text-sm text-gray-500">公開範囲: {article.visibility}</p>
                    <p className="text-sm text-gray-500">作成者: {article.author.name || "匿名"}</p>
                    <p className="text-sm text-gray-500">お気に入り数: {article._count?.favorites || 0}</p>
                </div>
                <div className="flex items-end">
                    <FavoriteButton articleId={article.id} isInitialFavorited={article.isFavorited || false} />
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;