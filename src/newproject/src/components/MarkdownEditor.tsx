"use client";

import React, { useCallback, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

type MarkdownEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }: MarkdownEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Tab") {
            return;
        }

        e.preventDefault();

        if (!textareaRef.current) {
            return;
        }

        const cursorPosition = textareaRef.current.selectionStart;

        if (!cursorPosition) {
            return;
        }

        const cursorLeft = textareaRef.current.value.substring(0, cursorPosition);
        const cursorRight = textareaRef.current.value.substring(cursorPosition, textareaRef.current.value.length);
        textareaRef.current.value = cursorLeft + "\t" + cursorRight;
        textareaRef.current.selectionEnd = cursorPosition + 1;
    }, [value, onChange]);

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
                    ref={textareaRef}
                    value={markdown}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Markdownを入力してください"
                    className="w-full h-64 p-2 border rounded resize-y"
                    spellCheck={false}
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