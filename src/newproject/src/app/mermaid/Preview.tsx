"use client";

import { useProcessMarkdown } from "./processMarkdownClient";

type PreviewProps = {
    code: string;
};

export const Preview: React.FC<PreviewProps> = ({ code }) => {
    const processedContent = useProcessMarkdown(code);
    return (
        <div className="prose h-full p-4 overflow-auto">
            <h2 className="text-lg font-bold mb-2">プレビュー</h2>
            <div className="mermaid" dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>
    );
};