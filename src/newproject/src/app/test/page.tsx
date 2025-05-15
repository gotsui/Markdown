"use client";

import React, { useState, ChangeEvent, useRef } from 'react';

const TabToMarkdownTable: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const outputRef = useRef<HTMLTextAreaElement>(null);

    const convertToMarkdownTable = (text: string): string => {
        if (!text.trim()) return '';

        const rows = text.trim().split('\n').map(row => row.split('\t'));
        const headers = rows[0];
        if (!headers) return '';

        let markdown = `|${headers.join('|')}|\n`;
        markdown += `|${headers.map(() => '-').join('|')}|\n`;
        rows.slice(1).forEach(row => {
            markdown += `|${row.join('|')}|\n`;
        });

        return markdown;
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);
        setOutput(convertToMarkdownTable(value));
    };

    const handleSelectAll = () => {
        if (outputRef.current) {
            outputRef.current.select();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // デフォルトのタブ移動をキャンセル
            const textarea = e.target as HTMLTextAreaElement;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            // カーソル位置にタブ文字を挿入
            const newValue = value.substring(0, start) + '\t' + value.substring(end);
            setInput(newValue);

            // カーソルをタブ文字の後ろに移動
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);

            // 変換を更新
            setOutput(convertToMarkdownTable(newValue));
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Tab to Markdown Table Converter</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                        Input (Tab-separated data)
                    </label>
                    <textarea
                        id="input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter tab-separated data (e.g., a\tb\tc\n1\t2\t3)"
                        className="w-full h-32 p-3 font-mono text-sm border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                            Output (Markdown Table)
                        </label>
                        <button
                            onClick={handleSelectAll}
                            disabled={!output}
                            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Select All
                        </button>
                    </div>
                    <textarea
                        id="output"
                        ref={outputRef}
                        value={output}
                        readOnly
                        placeholder="Markdown table will appear here"
                        className="w-full h-32 p-3 font-mono text-sm border rounded-md bg-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                    />
                </div>
            </div>
        </div>
    );
};

export default TabToMarkdownTable;