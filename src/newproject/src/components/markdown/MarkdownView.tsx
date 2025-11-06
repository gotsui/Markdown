"use client";

import { useEffect, useRef, useState } from "react";
import { parse } from "@/lib/markdown/markdownProcessor";
import { TocItem } from "../TableOfContents";

type MarkdownViewProps = {
    markdown: string;
    setTocItems?: (tocItems: TocItem[]) => void;
};

const MarkdownView = ({
    markdown,
    setTocItems,
}: MarkdownViewProps) => {
    const [parsed, setParsed] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        parse(markdown).then((value) => setParsed(value));
    }, [markdown]);

    useEffect(() => {
        if (!ref.current || !setTocItems) return;

        setTocItems(
            Array.from(
                ref.current.querySelectorAll("h1, h2, h3")
            ).map((elm) => ({
                id: elm.id,
                text: elm.textContent || "",
                depth: parseInt(elm.tagName.charAt(1)),
            }))
        );
    }, [parsed, setTocItems]);

    return (
        <div className="prose max-w-none">
            <div ref={ref} className="mermaid" dangerouslySetInnerHTML={{ __html: parsed }} />
        </div>
    );
};

export default MarkdownView;
