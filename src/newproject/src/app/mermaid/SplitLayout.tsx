"use client";

import { useContext, useState } from "react";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import MarkdownContext from "@/content/MarkdownContent";

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

const SplitLayout = () => {
    const context = useContext(MarkdownContext);

    if (!context) {
        throw new Error("MarkdownEditor must be used within a MarkdownContext");
    }

    const { markdown, updateMarkdown } = context;
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

    const handleInsertTemplate = () => {
        if (markdown) {
            if(!window.confirm("入力内容が上書きされます。\nよろしいですか。")) {
                return;
            }
        }

        updateMarkdown(mermaidTemplates[selectedTemplateIndex].template);
    };

    return (
        <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 p-4">
                <div className="flex flex-col h-full">
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
                    <MarkdownEditor />
                </div>
            </div>
            <div className="w-full md:w-1/2 p-4">
                <h2 className="text-lg font-semibold mb-2">プレビュー</h2>
                <MarkdownPreview />
            </div>
        </div>
    );
};

export default SplitLayout;
