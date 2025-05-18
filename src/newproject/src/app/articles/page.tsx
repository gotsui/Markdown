import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ArticleCard from "@/components/ArticleCard";
import React from "react";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import logger from "@/lib/logger";

const ArticlesPage = async () => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const headersList = await headers();
    const requestUrl = headersList.get("x-request-url") || undefined;
    const userLogger = logger.child({ userId, url: requestUrl, event: "ArticlesPage" });
    userLogger.info({});

    const whereClause: { OR: Prisma.ArticleWhereInput[] } = {
        OR: [{ visibility: "PUBLIC" }],
    };

    if (session && session.user) {
        whereClause.OR.push({ authorId: session.user.id });
    }

    const articles = await prisma.article.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: { author: true }
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ドキュメント一覧</h1>
            <div className="grid gap-4">
                {articles.length === 0 && <p>ドキュメントがありません。</p>}
                {articles.map((article: any) => (
                    <ArticleCard key={article.id} article={article} session={session} />
                ))}
            </div>
        </div>
    );
};

export default ArticlesPage;