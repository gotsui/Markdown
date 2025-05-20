"use client";

import React, { useState, ChangeEvent, useRef } from "react";

const TreeEditor: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [copyStatus, setCopyStatus] = useState<string>("");
    const outputRef = useRef<HTMLTextAreaElement>(null);

    const convertToTree = (text: string): string => {
        if (!text.trim()) {
            return "";
        }

        const rows = text.split("\n");
        let tree = "";

        for (let i = 0; i < rows.length; i++) {
            const rowValue = rows[i];
            const matched = rowValue.trimEnd().match(/\t/g);
            const depth = matched ? matched.length : 0;
            tree += `${" ".repeat(depth * 4)}${depth > 0 ? "└ " : ""}${rowValue.trim()}\n`;
        }

        return tree;
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);
        setOutput(convertToTree(value));
    };

    const handleSelectAll = () => {
        if (outputRef.current) {
            outputRef.current.select();
        }
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
            setInput(nextValue);

            setTimeout(() => {
                textarea.selectionStart = nextStartPosition;
                textarea.selectionEnd = nextEndPosition;
            }, 0);

            setOutput(convertToTree(nextValue));
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

            setInput(nextValue);

            setTimeout(() => {
                textarea.selectionStart = nextStartPosition;
                textarea.selectionEnd = nextEndPosition;
            }, 0);

            setOutput(convertToTree(nextValue));
        }
    };

    const handleCopyToClipboard = () => {
        if (!outputRef.current || !output) {
            setCopyStatus("Nothing to copy");
            return;
        }

        try {
            outputRef.current.select();
            const success = document.execCommand("copy");
            if (success) {
                setCopyStatus("Copied to clipboard!");
            } else {
                setCopyStatus("Copy failed. Please copy manually.");
            }
        } catch (err) {
            setCopyStatus("Copy failed. Please copy manually.");
            console.error("Copy error:", err);
        }

        // ステータスメッセージを3秒後にクリア
        setTimeout(() => setCopyStatus(""), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Tree Editor</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                        Input (Tab-indexed data)
                    </label>
                    <textarea
                        id="input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter tab-separated data (e.g., parent\n\tchild\n\t\tgrandchild)"
                        className="w-full h-32 p-3 font-mono text-sm border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                            Output (Markdown Table)
                        </label>
                        <div className="flex space-x-2">
                        <button
                            onClick={handleSelectAll}
                            disabled={!output}
                            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Select All
                        </button>
                        <button
                            onClick={handleCopyToClipboard}
                            disabled={!output}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Copy
                        </button>
                        </div>
                    </div>
                    <textarea
                        id="output"
                        ref={outputRef}
                        value={output}
                        readOnly
                        placeholder="Markdown table will appear here"
                        className="w-full h-32 p-3 font-mono text-sm border rounded-md bg-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                    />
                    {copyStatus && (
                        <p
                            className={`mt-2 text-sm ${
                                copyStatus.includes("Copied") ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {copyStatus}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TreeEditor;