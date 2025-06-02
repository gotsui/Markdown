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

    return (
        <div className="h-full p-4">
            <h2 className="text-lg font-bold mb-2">Mermaidエディタ</h2>
            <textarea
                className="w-full h-[calc(100%-2rem)] p-2 border rounded resize-none font-mono"
                value={code}
                onChange={handleChange}
            />
        </div>
    );
};