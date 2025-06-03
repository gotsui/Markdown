"use client";

import { useState } from "react";

type EditorProps = {
    onChange: (code: string) => void;
};

export const Editor: React.FC<EditorProps> = ({ onChange }) => {
    const [code, setCode] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const nextCode = e.target.value;
        setCode(nextCode);
        onChange(nextCode);
    };
    
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
            setCode(nextValue);

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

            setCode(nextValue);

            setTimeout(() => {
                textarea.selectionStart = nextStartPosition;
                textarea.selectionEnd = nextEndPosition;
            }, 0);
        }
    };

    return (
        <div className="h-full p-4">
            <h2 className="text-lg font-bold mb-2">Mermaidエディタ</h2>
            <textarea
                className="w-full h-[calc(100%-2rem)] p-2 border rounded resize-none font-mono"
                value={code}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                spellCheck={false}
            />
        </div>
    );
};