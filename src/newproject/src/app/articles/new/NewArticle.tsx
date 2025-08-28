"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MarkdownContext from "@/content/MarkdownContent";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import useMarkdown from "@/hooks/useMarkdown";

const NewArticle: React.FC = () => {
    const markdownContent = useMarkdown();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "DRAFT">("PUBLIC");
    const [content, setContent] = useState("");

    // 認証チェック
    if (status === "loading") {
        // セッション取得中の表示
        return <div>Loading...</div>;
    }

    const handleSubmit = async () => {
        try {
            // メタデータの保存
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug,
                    description,
                    visibility,
                    authorId: session?.user?.id,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create article");
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
            console.error("Error saving article:", error);
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <h1 className="text-2xl font-bold mb-4">新規作成</h1>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="text"
                    placeholder="Slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
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
                    name="visibility"
                    onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="PUBLIC">公開</option>
                    <option value="PRIVATE">非公開</option>
                    <option value="DRAFT">下書き</option>
                </select>
            </div>
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
            <div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white rounded mt-4 px-4 py-2 hover:bg-blue-600"
                >
                    保存
                </button>
            </div>
        </div>
    );
};

export default NewArticle;