"use client";

import { useEffect, useState } from "react";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

type TocItem = {
    id: string;
    text: string;
    depth: number;
};

type TableOfContentsProps = {
    markdown: string;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ markdown }) => {
    const [toc, setToc] = useState<TocItem[]>([]);

    useEffect(() => {
        const generateToc = async () => {
            const processor = remark();
            const tree = processor.parse(markdown);
            const items: TocItem[] = [];

            visit(tree, "heading", (node: any) => {
                const text: string = toString(node);
                const id = text;
                items.push({id, text, depth: node.depth});
            });

            setToc(items);
        };

        generateToc();
    }, [markdown]);

    if (toc.length === 0) {
        return null;
    }

    return (
        <nav className="toc mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">目次</h2>
            <ul className="list-none">
                {toc.map((item) => (
                    <li
                        key={item.id}
                        className={`ml-${(item.depth - 1) * 4} mb-1`}
                    >
                        <a
                            href={`#${encodeURIComponent(item.id)}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById(encodeURIComponent(item.id))
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;