import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { readMarkdown, saveMarkdown } from "@/lib/markdown";
import { isAuthorOrAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const userLogger = logger.child({ userId, method: req.method, url: req.url });

    if (!session || !session.user) {
        userLogger.warn({}, "未認証のリクエスト");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            userLogger.warn({ slug }, "スラッグなし");
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({ where: { slug }});

        if (!article) {
            userLogger.warn({ slug }, "対象ドキュメントなし");
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (!isAuthorOrAdmin(article.authorId, session)) {
            userLogger.warn({ slug }, "アクセス権限なし");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const content = await readMarkdown(slug);
        userLogger.info({ slug }, "ドキュメント取得成功");
        return NextResponse.json({ content }, { status: 200 });
    } catch (error) {
        userLogger.error({ error }, "ドキュメント取得失敗");
        return NextResponse.json({ error: "Failed to read markdown" }, { status: 500 });
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
        const { slug, content } = await req.json();
        const article = await prisma.article.findUnique({ where: { slug }});

        if (!article) {
            userLogger.warn({ slug }, "対象ドキュメントなし");
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (!isAuthorOrAdmin(article.authorId, session)) {
            userLogger.warn({ slug }, "アクセス権限なし");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await saveMarkdown(slug, content);
        userLogger.info({ slug }, "ドキュメント保存成功");
        return NextResponse.json({ message: "Markdown saved" }, { status: 200 });
    } catch (error) {
        userLogger.error({ error }, "ドキュメント保存失敗");
        return NextResponse.json({ error: "Failed to save markdown" }, { status: 500 });
    }
}