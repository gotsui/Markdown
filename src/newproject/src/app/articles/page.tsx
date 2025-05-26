import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ArticleCard from "@/components/ArticleCard";
import React from "react";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import logger from "@/lib/logger";
import FilterForm from "@/components/FilterForm";
import { sortBy } from "lodash";

const getFiltersFromSearchParams = (searchParams: { [key: string]: string | undefined }): ArticleFilter => {
    const visibilities = searchParams.visibilities?.split(",") as Visibility[] | undefined;
    const sortBy = searchParams.sortBy as SortBy | undefined;
    const sortOrder = searchParams.sortOrder as SortOrder | undefined;

    return {
        visibilities: visibilities?.filter((v) => ["PUBLIC", "PRIVATE", "DRAFT"].includes(v)),
        search: searchParams.search || undefined,
        author: searchParams.author || undefined,
        onlyMyArticles: searchParams.onlyMyArticles === "true",
        sortBy: sortBy && ["createdAt", "updatedAt", "title"].includes(sortBy) ? sortBy : "createdAt",
        sortOrder: sortOrder && ["asc", "desc"].includes(sortOrder) ? sortOrder : "desc",
    };
};

const ArticlesPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const headersList = await headers();
    const requestUrl = headersList.get("x-request-url") || undefined;
    const userLogger = logger.child({ userId, url: requestUrl, event: "ArticlesPage" });
    userLogger.info({});

    const userRole = session?.user?.role ?? null;
    const filters = getFiltersFromSearchParams(searchParams);
    const where: Prisma.ArticleWhereInput = {};
    where.AND = [];

    if (userId && filters.onlyMyArticles) {
        where.authorId = userId;
    }

    if (filters.search) {
        where.AND.push({
            OR: [
                // mode: "insensitive"
                // 大文字小文字の区別をせずに検索
                // PostgreSQLかMongoDB以外ではエラー
                { title: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
            ]
        });
    }

    if (userRole && userRole === "ADMIN") {
        if (filters.author) {
            where.author = { name: { contains: filters.author, mode: "insensitive" } };
        }

        if (filters.visibilities) {
            where.visibility = { in: filters.visibilities };
        }
    } else {
        const baseWhere: { OR: Prisma.ArticleWhereInput[] } = {
            OR: [{ visibility: "PUBLIC" }],
        };

        if (userId) {
            baseWhere.OR.push({ authorId: userId });
        }

        where.AND.push(baseWhere);

        if (filters.author) {
            where.author = { name: { contains: filters.author, mode: "insensitive" } };
        }

        if (filters.visibilities) {
            where.visibility = { in: filters.visibilities };
        }
    }

    const articles = await prisma.article.findMany({
        where,
        include: { author: true },
        orderBy: { [filters.sortBy!]: filters.sortOrder },
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ドキュメント一覧</h1>
            <FilterForm currentFilters={filters} />
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