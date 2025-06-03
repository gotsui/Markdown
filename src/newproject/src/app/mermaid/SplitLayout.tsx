"use client";

import { useCallback, useState } from "react";
import { debounceRender } from "./debounce";
import { Editor } from "./Editor";
import { Preview } from "./Preview";

export const SplitLayout: React.FC = () => {
    const [code, setCode] = useState<string>("");

    const handleCodeChange = useCallback((nextCode: string) => {
        debounceRender(() => setCode(nextCode));
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 border-r">
                <Editor onChange={handleCodeChange} />
            </div>
            <div className="w-full md:w-1/2">
                <Preview code={code} />
            </div>
        </div>
    );
};