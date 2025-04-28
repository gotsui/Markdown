"use client";

import React, { useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

type MarkdownEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }: MarkdownEditorProps) => {
    const [markdown, setMarkdown] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setMarkdown(newValue);
        onChange(newValue);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <h2 className="text-lg font-semibold mb-2">編集</h2>
                <textarea
                    value={markdown}
                    onChange={handleChange}
                    placeholder="Markdownを入力してください"
                    className="w-full h-64 p-2 border rounded resize-y"
                />
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2">プレビュー</h2>
                <div className="prose max-w-none border rounded p-2 h-64 overflow-auto">
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {markdown}
                    </Markdown>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditor;