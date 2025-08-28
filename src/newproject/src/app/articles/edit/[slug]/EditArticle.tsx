"use client";

import React, { useState, useEffect } from "react";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { isAuthorOrAdmin } from "@/lib/auth";
import useMarkdown from "@/hooks/useMarkdown";
import MarkdownContext from "@/content/MarkdownContent";

type Props = {
    params: { slug: string };
};

const EditArticle: React.FC<Props> = ({ params }) => {
    const markdownContent = useMarkdown();
    const { markdown, updateMarkdown } = markdownContent;

    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState(params.slug);
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
    const [isLoading, setIsLoading] = useState(true);
    const [stayOnPage, setStayOnPage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // メタデータを取得
                const articleRes = await fetch(`/api/articles?slug=${params.slug}`);

                if (!articleRes.ok) {
                    throw new Error("Failed to fetch article");
                }

                const article: Article = await articleRes.json();

                if (!isAuthorOrAdmin(article.authorId, session)) {
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
                updateMarkdown(markdownContent, false);
            } catch (error) {
                console.error("Error fetching article:", error);
                router.push("/articles");
            } finally {
                setIsLoading(false);
            }
        };

        if (status !== "loading") {
            fetchArticle();
        }
    }, [params.slug, status, router]);

    if (status === "loading" || isLoading) {
        return <div>Loading...</div>;
    }

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const handleSubmit = async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // メタデータ更新
            const res = await fetch(`/api/articles`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalSlug: params.slug,
                    title,
                    slug,
                    description,
                    visibility,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "保存に失敗しました");
                setIsSaving(false);
                throw new Error("Failed to update article");
            }

            // Markdownを保存
            const markdownRes = await fetch("/api/articles/markdown", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, content: markdown }),
            });

            if (!markdownRes.ok) {
                const data = await markdownRes.json();
                setError(data.error || "保存に失敗しました");
                setIsSaving(false);
                throw new Error("Failed to save markdown");
            }

            setIsSaving(false);
            setSuccessMessage("保存しました");

            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            if (!stayOnPage) {
                router.push(`/articles/${slug}`);
            }
        } catch (error) {
            console.error("Error updating article:", error);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4">
            <details className="border rounded-lg px-4 py-2 mb-2">
                <summary className="cursor-pointer font-semibold text-lg flex items-center">
                    <span className="mr-2">メタデータ</span>
                    <svg
                        className="w-5 h-5 transform transition-transform duration-200 [&[open]]:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>
                <div className="mt-4 space-y-4">
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
                </div>
            </details>
            <MarkdownContext value={markdownContent}>
                <div className="flex-1 flex flex-col md:flex-row space-x-4 py-2">
                    <div className="flex flex-col h-full w-full md:w-1/2">
                        <h2 className="text-lg font-bold mb-2">編集</h2>
                        <div className="flex-1 flex flex-col">
                            <MarkdownEditor />
                        </div>
                    </div>
                    <div className="flex flex-col h-full w-full md:w-1/2">
                        <h2 className="text-lg font-bold mb-2">プレビュー</h2>
                        <div className="flex-1 basis-0 flex flex-col max-w-none border rounded p-2 overflow-auto">
                            <MarkdownPreview />
                        </div>
                    </div>
                </div>
            </MarkdownContext>
            <div className="flex items-center space-x-2 mt-4">
                <input
                    type="checkbox"
                    checked={stayOnPage}
                    onChange={(e) => setStayOnPage(e.target.checked)}
                    id="stayOnPage"
                />
                <label htmlFor="stayOnPage" className="text-sm">保存後このページに留まる</label>
            </div>
            <div className="flex items-center space-x-4 mt-4">
                <button
                    onClick={handleSubmit}
                    className="
                        px-4 py-2 bg-blue-500
                        text-white rounded
                        hover:bg-blue-600 disabled:bg-gray-400
                    "
                    disabled={isSaving}
                >
                    {isSaving ? "保存中..." : "保存"}
                </button>
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
            </div>
        </div>
    );
};

export default EditArticle;