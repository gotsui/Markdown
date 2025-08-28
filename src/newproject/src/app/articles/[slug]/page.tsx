import prisma from "@/lib/prisma";
import { readMarkdown } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prisma } from "@/generated/prisma";

type Props = {
    params: Promise<{ slug: string }>;
};

type ArticleWithAuthor = Prisma.ArticleGetPayload<{
    include: { author: true };
}>;

const ArticlePage: React.FC<Props> = async ({ params }) => {
    const session = await getServerSession(authOptions);
    const { slug } = await params;
    const article: ArticleWithAuthor | null = await prisma.article.findUnique({
        where: {
            slug: slug,
        },
        include: {
            author: true,
        },
    });

    if (!article) {
        notFound();
    }

    if (
        article.visibility !== "PUBLIC" &&
        (!session?.user || (session.user.id !== article.authorId && session.user.role !== "ADMIN"))
    ) {
        notFound();
    }

    const content = await readMarkdown(slug);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <p className="text-gray-600 mb-4">{article.description || "説明なし"}</p>
            <p className="text-sm text-gray-500 mb-4">
                作成者: {article.author.name || "匿名"} | 公開状態: {article.visibility}
            </p>
            <div className="prose max-w-none">
                <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {content}
                </Markdown>
            </div>
        </div>
    );
};

export default ArticlePage;