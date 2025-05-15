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
        const nextValue = e.target.value;
        setMarkdown(nextValue);
        onChange(nextValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Tab") {
            return;
        }

        e.preventDefault();

        const textarea = e.target as HTMLTextAreaElement;
        const cursorPosition = textarea.selectionStart;
        const contentLeft = textarea.value.substring(0, cursorPosition);
        const contentRight = textarea.value.substring(cursorPosition);
        const nextValue = contentLeft + "\t" + contentRight;
        setMarkdown(nextValue);
        onChange(nextValue);

        setTimeout(() => {
            textarea.selectionEnd = cursorPosition + 1;
        }, 0);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <h2 className="text-lg font-semibold mb-2">編集</h2>
                <textarea
                    value={markdown}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Markdownを入力してください"
                    className="w-full h-160 p-2 border rounded resize-y"
                    spellCheck={false}
                />
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2">プレビュー</h2>
                <div className="prose max-w-none border rounded p-2 h-160 overflow-auto">
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {markdown}
                    </Markdown>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditor;