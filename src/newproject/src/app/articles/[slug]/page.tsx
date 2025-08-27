import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isAuthorOrAdmin } from "@/lib/auth";
import EditButton from "@/components/EditButton";
import { readMarkdown } from "@/lib/markdown";
import TableOfContents from "@/components/TableOfContents";
import { headers } from "next/headers";
import logger from "@/lib/logger";
import ArticleDownloadButton from "@/components/ArticleDownloadButton";
import FavoriteButton from "@/components/FavoriteButton";
import MarkdownView from "@/components/markdown/MarkdownView";

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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <p className="text-gray-600 mb-4">{article.description || "説明なし"}</p>
            <div className="text-sm text-gray-600 mb-4">
                <p>作成者：{article.author.name || "匿名"}</p>
                <p>作成日：{new Date(article.createdAt).toLocaleDateString("ja-JP")}</p>
                <p>お気に入り数：{article._count?.favorites || 0}</p>
                <p>公開状態：{article.visibility}</p>
            </div>
            <div className="flex space-x-4 mb-4">
                <EditButton slug={slug} authorId={article.authorId} session={session} />
                <ArticleDownloadButton slug={slug} />
                <FavoriteButton articleId={article.id} isInitialFavorited={article.favorites ? article.favorites.length > 0 : false} />
            </div>
            <TableOfContents markdown={content} />
            <MarkdownView markdown={content} />
        </div>
    );
};

export default ArticlePage;