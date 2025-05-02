import prisma from "@/lib/prisma";
import { readMarkdown } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import Mermaid from "@/components/Mermaid";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { isAuthorOrAdmin } from "@/lib/auth";
import EditButton from "@/components/EditButton";

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

    if (article.visibility !== "PUBLIC" && !isAuthorOrAdmin(article.authorId, session)) {
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
            <div className="mb-4">
                <EditButton slug={slug} authorId={article.authorId} session={session} />
            </div>
            <div className="prose max-w-none">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code({ node, className, children, ref, ...props }) {
                            if (
                                className === "language-mermaid" &&
                                node?.children[0].type === "text"
                            ) {
                                return <Mermaid code={node?.children[0].value} />
                            } else {
                                const match = /language-(\w+)/.exec(className || "");

                                return match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus as any}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className}>{children}</code>
                                )
                            }
                        }
                    }}
                >
                    {content}
                </Markdown>
            </div>
        </div>
    );
};

export default ArticlePage;