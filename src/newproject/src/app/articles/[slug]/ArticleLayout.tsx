"use client";

import MarkdownView from "@/components/markdown/MarkdownView";
import TableOfContents, { TocItem } from "@/components/TableOfContents";
import { useState } from "react";

type ArticleLayoutProps = {
    markdown: string;
};

const ArticleLayout = ({
    markdown,
}: ArticleLayoutProps) => {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);

    return (
        <>
            <TableOfContents tocItems={tocItems} />
            <MarkdownView markdown={markdown} setTocItems={setTocItems} />
        </>
    );
};

export default ArticleLayout;