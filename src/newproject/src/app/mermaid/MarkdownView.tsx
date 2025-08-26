"use client";

import { useContext } from "react";
import MarkdownContext from "@/components/markdown/MarkdownContent";

const MarkdownView = () => {
    const context = useContext(MarkdownContext);

    if (!context) {
        throw new Error("MarkdownView must be used within a MarkdownContext");
    }

    const { parsed } = context;

    return (
        <div className="prose h-full p-4 overflow-auto">
            <h2 className="border-b text-lg font-bold mb-2">プレビュー</h2>
            <div className="mermaid" dangerouslySetInnerHTML={{ __html: parsed }} />
        </div>
    );
};

export default MarkdownView;
