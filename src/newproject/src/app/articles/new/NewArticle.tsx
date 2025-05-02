"use client";

import React, { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const NewArticle: React.FC = () => {
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Article</h1>
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
            <MarkdownEditor
                value={content}
                onChange={setContent}
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white rounded mt-4 px-4 py-2 hover:bg-blue-600"
            >
                保存
            </button>
        </div>
    );
};

export default NewArticle;