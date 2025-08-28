"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { parse } from "@/lib/markdown/markdownProcessor";

export type MarkdownContextValue = {
    markdown: string;
    parsed: string;
    updateMarkdown: (markdown: string, needDebounce?: boolean) => void;
};

const useMarkdown = (defalutMarkdown = ""): MarkdownContextValue => {
    const [markdown, setMarkdown] = useState(defalutMarkdown);
    const [parsed, setParsed] = useState<string>("");

    const parseMarkdown = useCallback(async (value: string) => {
        setParsed(await parse(value));
    }, []);

    const debouncedParse = useCallback(debounce(async (value) => {
        parseMarkdown(value);
    }, 500), []);

    const updateMarkdown = (nextMarkdown: string, needDebounce=true) => {
        setMarkdown(nextMarkdown);

        if (needDebounce){
            debouncedParse(nextMarkdown);
        } else {
            parseMarkdown(nextMarkdown);
        }
    };

    useEffect(() => {
        parseMarkdown(defalutMarkdown);
        return () => debouncedParse.cancel();
    }, [defalutMarkdown, parseMarkdown, debouncedParse]);

    return { markdown, parsed, updateMarkdown };
};

export default useMarkdown;
