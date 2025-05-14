"use client";

import { useState } from "react";

const TestPage = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const convertToMarkdownTable = (text: string): string => {
        if (!text.trim()) {
            return "";
        }

        // 行ごとに分割
        const rows = text.trim().split('\n').map(row => row.split('\t'));

        // ヘッダー行
        const headers = rows[0];
        if (!headers) {
            return "";
        }

        // テーブルヘッダー
        let markdown = `|${headers.join('|')}|\n`;
        // セパレータ行
        markdown += `|${headers.map(() => '-').join('|')}|\n`;
        // データ行
        rows.slice(1).forEach(row => {
            markdown += `|${row.join('|')}|\n`;
        });

        return markdown;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);
        setOutput(convertToMarkdownTable(value));
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
        setInput(nextValue);
        setOutput(nextValue);
        textarea.selectionEnd = cursorPosition + 1;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Tab to Markdown Table Converter</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label htmlFor="input">Input (Tab-separated data):</label>
                    <textarea
                        id="input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter tab-separated data (e.g., a\tb\tc\n1\t2\t3)"
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            fontFamily: 'monospace',
                            resize: 'vertical',
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="output">Output (Markdown Table):</label>
                    <textarea
                        id="output"
                        value={output}
                        readOnly
                        placeholder="Markdown table will appear here"
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            fontFamily: 'monospace',
                            resize: 'vertical',
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TestPage;