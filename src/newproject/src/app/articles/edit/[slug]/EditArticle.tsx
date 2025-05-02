"use client";

import React, { useState, useEffect } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

type Props = {
    params: { slug: string };
};

const EditArticle: React.FC<Props> = ({ params }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState(params.slug);
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "DRAFT">("PUBLIC");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // メタデータを取得
                const articleRes = await fetch(`/api/articles?slug=${params.slug}`);

                if (!articleRes.ok) {
                    throw new Error("Failed to fetch article");
                }

                const article: Article = await articleRes.json();

                if (!article || (session?.user?.id !== article.authorId  && session?.user?.role !== "ADMIN")) {
                    router.push("/articles");
                    return;
                }

                setTitle(article.title);
                setDescription(article.description || "");
                setVisibility(article.visibility);

                // Markdownを取得
                const markdownRes = await fetch(`/api/articles/markdown?slug=${params.slug}`);

                if (!markdownRes.ok) {
                    throw new Error("Failed to fetch markdown");
                }

                const { content: markdownContent } = await markdownRes.json();
                setContent(markdownContent);
            } catch (error) {
                console.error("Error fetching article:", error);
                router.push("/articles");
            } finally {
                setLoading(false);
            }
        };

        if (status !== "loading") {
            fetchArticle();
        }
    }, [params.slug, session, status, router]);

    if (status === "loading" || loading) {
        return <div>Loading...</div>;
    }

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const handleSubmit = async () => {
        try {
            // メタデータ更新
            const res = await fetch(`/api/articles`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalSlug: params.slug,
                    title,
                    slug,
                    visibility,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update article");
            }

            // Markdownを保存
            const markdownRes = await fetch("/api/articles/markdown", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, content }),
            });

            if (!markdownRes.ok) {
                throw new Error("Failed to save markdown");
            }

            router.push(`/articles/${slug}`);
        } catch (error) {
            console.error("Error updating article:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border"
            />
            <input
                type="text"
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2 mb-4 border"
            />
            <textarea
                placeholder="Description"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                spellCheck={false}
            />
            <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                className="w-full p-2 mb-4 border"
            >
                <option value="PUBLIC">公開</option>
                <option value="PRIVATE">非公開</option>
                <option value="DRAFT">下書き</option>
            </select>
            <MarkdownEditor value={content} onChange={setContent} />
            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                更新
            </button>
        </div>
    );
};

export default EditArticle;