"use client";

import { useContext, useState } from "react";
import MarkdownContext from "@/components/markdown/MarkdownContent";

const mermaidTemplates = [
    {
        type: "mermaid-flowchart-td",
        label: "フローチャート(上下)",
        template: `\`\`\`mermaid
graph TD;
  A[Start] --> B[Process];
  B --> C[End];
\`\`\`
`,
    },
    {
        type: "mermaid-flowchart-lr",
        label: "フローチャート(左右)",
        template: `\`\`\`mermaid
graph LR;
  A[Start] --> B[Process];
  B --> C[End];
\`\`\`
`,
    },
    {
        type: "mermaid-sequence",
        label: "シーケンス図",
        template: `\`\`\`mermaid
sequenceDiagram
  participant A as Alice;
  participant B as Bob;
  A->>B: Hello;
  B-->>A: Hi back;
\`\`\`
`,
    },
    {
        type: "mermaid-class",
        label: "クラス図",
        template: `\`\`\`mermaid
classDiagram
  class Animal {
    +String name
    +move()
  }
\`\`\`
`,
    },
    {
        type: "mermaid-er",
        label: "ER図",
        template: `\`\`\`mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ ITEM : contains
\`\`\`
`,
    },
    {
        type: "mermaid-gantt",
        label: "ガントチャート",
        template: `\`\`\`mermaid
gantt
  title Project Schedule
  dateFormat YYYY-MM-DD
  section Task
  Task A :a1, 2025-06-01, 7d
  Task B :after a1, 5d
\`\`\`
`,
    },
];

const MarkdownEditor = () => {
    const context = useContext(MarkdownContext);

    if (!context) {
        throw new Error("MarkdownEditor must be used within a MarkdownContext");
    }

    const { markdown, updateMarkdown } = context;
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
    
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

    const handleInsertTemplate = () => {
        if (markdown) {
            if(!window.confirm("入力内容が上書きされます。\nよろしいですか。")) {
                return;
            }
        }

        updateMarkdown(mermaidTemplates[selectedTemplateIndex].template);
    };

    return (
        <div className="flex flex-col h-full p-4">
            <h2 className="text-lg font-bold mb-2">Mermaidエディタ</h2>
            <label htmlFor="mermaid-template" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                テンプレート
            </label>
            <div className="flex space-x-4 mb-2">
                <select
                    id="mermaid-template"
                    value={selectedTemplateIndex}
                    onChange={(e) => setSelectedTemplateIndex(Number(e.target.value))}
                    className="p-2 border rounded"
                >
                    {mermaidTemplates.map((template, index) => (
                        <option key={template.type} value={index}>
                            {template.label}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleInsertTemplate}
                    className="px-4 py-2 border rounded text-white bg-blue-500 hover:bg-blue-600"
                >
                    挿入
                </button>
            </div>
            <textarea
                className="flex-auto w-full p-2 border rounded resize-none font-mono"
                value={markdown}
                onChange={(e) => updateMarkdown(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
            />
        </div>
    );
};

export default MarkdownEditor;
