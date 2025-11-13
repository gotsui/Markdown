import React from "react";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import ArticlesLayout from "./ArticlesLayout";
import { authOptions } from "../api/auth/[...nextauth]/route";

const getFiltersFromSearchParams = async (searchParams: { [key: string]: string | undefined }): Promise<ArticleFilter> => {
    const params = await searchParams;
    const visibilities = params.visibilities?.split(",") as Visibility[] | undefined;
    const sortBy = params.sortBy as SortBy | undefined;
    const sortOrder = params.sortOrder as SortOrder | undefined;

    return {
        visibilities: visibilities?.filter((v) => ["PUBLIC", "PRIVATE", "DRAFT"].includes(v)),
        search: params.search || undefined,
        author: params.author || undefined,
        onlyMyArticles: params.onlyMyArticles === "true",
        onlyFavorites: params.onlyFavorites === "true",
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
    const filters = await getFiltersFromSearchParams(searchParams);
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

    if (filters.onlyFavorites && userId) {
        where.favorites = { some: { userId } };
    }

    const include: Prisma.ArticleInclude = {
        author: true,
        _count: { select: { favorites: true } }, 
    };

    if (userId) {
        include.favorites = { where: { userId } };
    }

    const articles = await prisma.article.findMany({
        where,
        include,
        orderBy: { [filters.sortBy!]: filters.sortOrder },
    });

    // お気に入り判定値追加
    const articlesWithFavoriteStatus = articles.map((article) => ({
        ...article,
        isFavorited: article.favorites ? article.favorites.length > 0 : false,
    }));

    return (
        <ArticlesLayout
            userId={userId}
            filters={filters}
            articles={articlesWithFavoriteStatus}
        />
    );
};

export default ArticlesPage;