"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import parse from "./parse";

export type MarkdownContextValue = {
    markdown: string;
    parsed: string;
    updateMarkdown: (markdown: string) => void;
};

const useMarkdown = (defalutMarkdown = ""): MarkdownContextValue => {
    const [markdown, setMarkdown] = useState(defalutMarkdown);
    const [parsed, setParsed] = useState<string>("");

    const debouncedParse = useCallback(debounce(async (value) => {
        setParsed(await parse(value));
    }, 500), []);

    const updateMarkdown = (nextMarkdown: string) => {
        setMarkdown(nextMarkdown);
        debouncedParse(nextMarkdown);
    };

    useEffect(() => {
        debouncedParse(defalutMarkdown);
        return () => debouncedParse.cancel();
    }, [defalutMarkdown, debouncedParse]);

    return { markdown, parsed, updateMarkdown };
};

export default useMarkdown;
