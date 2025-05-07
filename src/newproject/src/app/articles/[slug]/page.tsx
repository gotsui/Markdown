import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isAuthorOrAdmin } from "@/lib/auth";
import EditButton from "@/components/EditButton";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { readMarkdown } from "@/lib/markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Mermaid from "@/components/Mermaid";
import TableOfContents from "@/components/TableOfContents";
import { toString } from "mdast-util-to-string";

type Props = {
    params: Promise<{ slug: string }>;
};

type ArticleWithAuthor = Prisma.ArticleGetPayload<{
    include: { author: true };
}>;

const generateUniqueId = (text: string, idCounter: { [key: string]: number }) => {
    let id = text;

    if (idCounter[id] !== undefined) {
        idCounter[id]++;
        id = `${text}-${idCounter[id]}`;
    } else {
        idCounter[id] = 0;
    }

    return id;
}

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

    let content: string;

    try {
        content = await readMarkdown(slug);
    } catch (error) {
        console.error('Error reading markdown:', error);

        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <p className="text-red-500">Failed to load article content.</p>
            </div>
        );
    }

    const idCounter: { [key: string]: number } = {};

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
            <TableOfContents markdown={content} />
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
                                        style={vs2015 as any}
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
                        },
                        h1({ node, children, ...props }) {
                            const text = toString(node) || '';
                            const id = generateUniqueId(text, idCounter);
                            return <h1 id={encodeURIComponent(id)} {...props}>{children}</h1>
                        },
                        h2({ node, children, ...props }) {
                            const text = toString(node) || '';
                            const id = generateUniqueId(text, idCounter);
                            return <h2 id={encodeURIComponent(id)} {...props}>{children}</h2>
                        },
                        h3({ node, children, ...props }) {
                            const text = toString(node) || '';
                            const id = generateUniqueId(text, idCounter);
                            return <h3 id={encodeURIComponent(id)} {...props}>{children}</h3>
                        },
                    }}
                >
                    {content}
                </Markdown>
            </div>
        </div>
    );
};

export default ArticlePage;