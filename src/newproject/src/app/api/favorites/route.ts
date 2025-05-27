import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const userLogger = logger.child({ userId, method: req.method, url: req.url });

    if (!session) {
        userLogger.warn({}, "未認証のリクエスト");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await req.json();

    if (!articleId) {
        userLogger.warn({}, "ドキュメントIDなし")
        return NextResponse.json({ error: "Article not found" }, { status: 400 });
    }

    try {
        await prisma.favorite.create({
            data: {
                userId: session.user.id,
                articleId,
            },
        });

        userLogger.info({ userId: session.user.id, articleId }, "お気に入りに追加");
        return NextResponse.json({ message: "favorite_added" }, { status: 201 });
    } catch (error) {
        userLogger.error({ error, userId: session.user.id, articleId }, "お気に入りに追加失敗");
        return NextResponse.json({ error: "favorite_add_failed" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const userLogger = logger.child({ userId, method: req.method, url: req.url });

    if (!session) {
        userLogger.warn({}, "未認証のリクエスト");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await req.json();

    if (!articleId) {
        userLogger.warn({}, "ドキュメントIDなし")
        return NextResponse.json({ error: "Article not found" }, { status: 400 });
    }

    try {
        await prisma.favorite.deleteMany({
            where: {
                userId: session.user.id,
                articleId,
            },
        });

        userLogger.info({ userId: session.user.id, articleId }, "お気に入りを解除");
        return NextResponse.json({ message: "favorite_removed" });
    } catch (error) {
        userLogger.error({ error, userId: session.user.id, articleId }, "お気に入りの解除失敗");
        return NextResponse.json({ error: "favorite_remove_failed" }, { status: 500 });
    }
}