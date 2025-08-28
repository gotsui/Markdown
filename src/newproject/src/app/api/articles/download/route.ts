import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { join } from "node:path";
import { promises as fs } from "node:fs";
import logger from "@/lib/logger";
import { isAuthorOrAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const userLogger = logger.child({ userId, method: req.method, url: req.url });

    if (!slug) {
        userLogger.warn({ slug }, "スラッグなし");
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    try {
        const article = await prisma.article.findUnique({
            where: { slug },
        });

        if (!article) {
            userLogger.warn({ slug }, "ドキュメントなし");
            return NextResponse.json({ error: "ドキュメントが見つかりません" }, { status: 404 });
        }

        if (!isAuthorOrAdmin(article.authorId, session)) {
            logger.warn({ slug }, "アクセス権限なし");
            return NextResponse.json({ error: "アクセス権限がありません"}, { status: 403 });
        }

        const filePath = join(process.cwd(), "articles", `${article.slug}.md`);
        const fileContent = await fs.readFile(filePath);

        logger.info({ slug }, "ドキュメントダウンロード");
        return new NextResponse( fileContent, {
            status: 200,
            headers: {
                "Content-Type": "text/markdown",
                "Content-Disposition": `attachment; filename="${article.slug}.md"`,
            },
        });
    } catch (error) {
        logger.error({ error, slug }, "ドキュメントダウンロード失敗");
        return NextResponse.json({ error: "サーバエラーが発生しました" }, { status: 500 });
    }
}