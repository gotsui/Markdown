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
    {
        type: "mermaid-architecture",
        label: "アーキテクチャ図",
        template: `\`\`\`mermaid
architecture-beta
    group api(logos:aws-lambda)[API]

    service db(logos:aws-aurora)[Database] in api
    service disk1(logos:aws-glacier)[Storage] in api
    service disk2(logos:aws-s3)[Storage] in api
    service server(logos:aws-ec2)[Server] in api

    db:L -- R:server
    disk1:T -- B:server
    disk2:T -- B:db
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
            <div className="flex flex-col h-full w-full md:w-1/2 p-4">
                <div>
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
                </div>
                <div className="flex-1 flex flex-col">
                    <MarkdownEditor />
                </div>
            </div>
            <div className="flex flex-col h-full w-full md:w-1/2 p-4">
                <h2 className="text-lg font-semibold mb-2">プレビュー</h2>
                <div className="max-w-none border rounded p-2 h-full overflow-auto">
                    <MarkdownPreview />
                </div>
            </div>
        </div>
    );
};

export default SplitLayout;
