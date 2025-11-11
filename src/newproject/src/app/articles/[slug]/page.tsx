import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isAuthorOrAdmin } from "@/lib/auth";
import { readMarkdown } from "@/lib/markdown";
import { headers } from "next/headers";
import logger from "@/lib/logger";
import ArticleLayout from "./ArticleLayout";

type Props = {
    params: Promise<{ slug: string }>;
};

const ArticlePage: React.FC<Props> = async ({ params }) => {
    const session = await getServerSession(authOptions);
    const { slug } = await params;
    const userId = session?.user?.id ?? null;
    const headersList = await headers();
    const requestUrl = headersList.get("x-request-url") || undefined;
    const userLogger = logger.child({ userId, url: requestUrl, event: "ArticlePage" });
    userLogger.info({});

    const include: Prisma.ArticleInclude = {
        author: true,
        _count: { select: { favorites: true } },
    };

    if (userId) {
        include.favorites = { where: { userId } };
    }

    const article = await prisma.article.findUnique({
        where: {
            slug: slug,
        },
        include,
    });

    if (!article) {
        userLogger.warn({ slug }, "対象ドキュメントなし");
        notFound();
    }

    if (article.visibility !== "PUBLIC" && !isAuthorOrAdmin(article.authorId, session)) {
        userLogger.warn({ slug }, "対象ドキュメント閲覧権限なし");
        notFound();
    }

    let content: string;

    try {
        content = await readMarkdown(slug);
    } catch (error) {
        userLogger.error({ slug, error }, "対象ドキュメント取得失敗");

        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <p className="text-red-500">ドキュメントの読み込みに失敗しました</p>
            </div>
        );
    }

    return (
        <ArticleLayout
            article={article}
            author={article.author}
            favorites={article.favorites}
            count={article._count}
            markdown={content}
            session={session}
        />
    );
};

export default ArticlePage;