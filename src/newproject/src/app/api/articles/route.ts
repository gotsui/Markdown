import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isAuthorOrAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const userId = session?.user?.id ?? null;
    const userLogger = logger.child({ userId, method: req.method, url: req.url });

    if (slug) {
        // 単一のドキュメントを取得
        try {
            const article = await prisma.article.findUnique({ where: { slug }});

            if (!article) {
                logger.warn({ slug }, "対象ドキュメントなし");
                return NextResponse.json({ error: "Article not found" }, { status: 404 });
            }

            if (article.visibility !== "PUBLIC" && !isAuthorOrAdmin(article.authorId, session)) {
                logger.warn({ slug }, "アクセス権限なし");
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

            userLogger.info({ slug }, "ドキュメント取得成功");
            return NextResponse.json(article, { status: 200 });
        } catch (error) {
            userLogger.error({ error, slug }, "ドキュメント取得失敗");
            return NextResponse.json({ error: "Failed to fetch article"}, { status: 500 });
        }
    }

    // ドキュメント一覧を取得
    const whereClause: { OR: Prisma.ArticleWhereInput[] } = {
        OR: [{ visibility: "PUBLIC" }],
    };

    if (session && session.user) {
        whereClause.OR.push({ authorId: session.user.id });
    }

    try {
        const articles = await prisma.article.findMany({ where: whereClause });
        userLogger.info({ articleCount: articles.length }, "ドキュメント一覧を取得");
        return NextResponse.json(articles);
    } catch (error) {
        userLogger.error({ error }, "ドキュメント一覧の取得失敗");
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const userLogger = logger.child({ userId, method: req.method, url: req.url });

    if (!session || !session.user) {
        userLogger.warn({}, "未認証のリクエスト");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const { title, slug, description, visibility, authorId } = await req.json();

        if (!isAuthorOrAdmin(authorId, session)) {
            userLogger.warn({}, "アクセス権限なし");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                description,
                visibility,
                authorId,
            },
        });

        userLogger.info({ slug }, "ドキュメント作成成功");
        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        userLogger.error({ error }, "ドキュメント作成失敗");
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const userLogger = logger.child({ userId, method: req.method, url: req.url });

    if (!session || !session.user) {
        userLogger.warn({}, "未認証のリクエスト");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { originalSlug, title, slug, description, visibility } = await req.json();
        const article = await prisma.article.findUnique({ where: { slug: originalSlug }});

        if (!article) {
            userLogger.warn({ originalSlug }, "対象ドキュメントなし");
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        if (!isAuthorOrAdmin(article.authorId, session)) {
            userLogger.warn({ originalSlug }, "アクセス権限なし");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (slug !== originalSlug) {
            const existingArticle = await prisma.article.findUnique({ where: { slug }});

            if (existingArticle) {
                userLogger.warn({ slug }, "スラッグ重複");
                return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
            }
        }

        const updatedArticle = await prisma.article.update({
            where: { slug: originalSlug },
            data: {
                title,
                slug,
                description,
                visibility,
                updatedAt: new Date(),
            },
        });

        userLogger.info({ slug }, "ドキュメント更新成功");
        return NextResponse.json(updatedArticle, { status: 200 });
    } catch (error) {
        userLogger.error({ error }, "ドキュメント更新失敗");
        return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
    }
}