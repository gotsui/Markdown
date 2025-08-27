"use client";

import { useEffect, useState } from "react";
import { parse } from "@/lib/markdown/markdownProcessor";

type MarkdownViewProps = {
    markdown: string;
};

const MarkdownView = ({ markdown }: MarkdownViewProps) => {
    const [parsed, setParsed] = useState("");

    useEffect(() => {
        parse(markdown).then((value) => setParsed(value));
    }, []);

    return (
        <div className="prose max-w-none">
            <div className="mermaid" dangerouslySetInnerHTML={{ __html: parsed }} />
        </div>
    );
};

export default MarkdownView;
