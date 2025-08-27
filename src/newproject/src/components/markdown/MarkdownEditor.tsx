"use client";

import { useContext } from "react";
import MarkdownContext from "@/content/MarkdownContent";

const MarkdownEditor = () => {
    const context = useContext(MarkdownContext);

    if (!context) {
        throw new Error("MarkdownEditor must be used within a MarkdownContext");
    }

    const { markdown, updateMarkdown } = context;
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Tab") {
            return;
        }

        // デフォルトのタブ移動をキャンセル
        e.preventDefault();

        if (e.shiftKey) {
            const textarea = e.target as HTMLTextAreaElement;
            const startPosition = textarea.selectionStart;
            const endPosition = textarea.selectionEnd;
            const value = textarea.value;
            const startRow = value.slice(0, startPosition).split("\n").length;
            const endRow = value.slice(startPosition, endPosition).split("\n").length + startRow - 1;
            const rowValues = value.split("\n");

            let nextStartPosition = startPosition;
            let nextEndPosition = endPosition;

            for (let i = startRow; i <= endRow; i++) {
                const currentIndex = i - 1;
                const currentRowValue = rowValues[currentIndex];

                if (!currentRowValue.startsWith("\t")) {
                    continue;
                }

                if (i === startRow) {
                    nextStartPosition--;
                }

                nextEndPosition--;
                rowValues[currentIndex] = currentRowValue.replace("\t", "");
            }

            const nextValue = rowValues.join("\n");
            updateMarkdown(nextValue);

            setTimeout(() => {
                textarea.selectionStart = nextStartPosition;
                textarea.selectionEnd = nextEndPosition;
            }, 0);
        } else {
            const textarea = e.target as HTMLTextAreaElement;
            const startPosition = textarea.selectionStart;
            const endPosition = textarea.selectionEnd;
            const value = textarea.value;
            let nextValue = "";
            let nextStartPosition = startPosition;
            let nextEndPosition = endPosition;

            if (startPosition === endPosition) {
                nextValue = value.substring(0, startPosition) + "\t" + value.substring(endPosition);
                nextStartPosition++;
                nextEndPosition++;
            } else {
                const startRow = value.slice(0, startPosition).split("\n").length;
                const endRow = value.slice(startPosition, endPosition).split("\n").length - 1 + startRow;

                if (startRow === endRow) {
                    nextValue = value.substring(0, startPosition) + "\t" + value.substring(endPosition);
                    nextEndPosition -= (endPosition - startPosition) - 1;
                } else {
                    const rowValues = value.split("\n");
                    for (let i = startRow; i <= endRow; i++) {
                        const currentIndex = i - 1;
                        rowValues[currentIndex] = "\t" + rowValues[currentIndex];
                    }

                    nextValue = rowValues.join("\n");
                    nextStartPosition++;
                    nextEndPosition += (endRow - startRow) + 1;
                }
            }

            updateMarkdown(nextValue);

            setTimeout(() => {
                textarea.selectionStart = nextStartPosition;
                textarea.selectionEnd = nextEndPosition;
            }, 0);
        }
    };

    return (
        <textarea
            className="flex-auto w-full p-2 border rounded resize-none font-mono"
            value={markdown}
            onChange={(e) => updateMarkdown(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
        />
    );
};

export default MarkdownEditor;
