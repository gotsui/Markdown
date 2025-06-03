"use client";

import { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import mermaid from "mermaid";
import type { Root as HastRoot, Element, ElementContent } from 'hast';
import remarkGfm from "remark-gfm";
import { fromHtml } from 'hast-util-from-html';

mermaid.initialize({
    startOnLoad: false,
    // theme: "dark",
});

const rehypeMermaid = () => {
    return async (tree: HastRoot) => {
        const promises: Promise<void>[] = [];

        visit(tree, "element", (node: Element) => {
            if (node.tagName !== "pre" || !node.children[0]) {
                return;
            }

            const elm = node.children[0] as Element;

            if (elm.tagName !== "code" || !elm.properties.className) {
                return;
            }

            const clsNm = elm.properties.className as string[];

            if (!clsNm.includes("language-mermaid")) {
                return;
            }

            const code = toString(elm);

            promises.push(
                (async () => {
                    try {
                        if (!await mermaid.parse(code)) {
                            return;
                        }

                        const { svg } = await mermaid.render(`mermaid-diagram-${Date.now()}`, code);
                        const svgHast = fromHtml(svg, { fragment: true });
                        const svgChildren: ElementContent[] = svgHast.children.filter(
                            (child): child is ElementContent => child.type === 'element' || child.type === 'text',
                        );

                        console.log('Original SVG:', svg);
                        console.log('SVG Hast:', svgHast);
                        console.log('Processed Children:', svgChildren);

                        node.tagName = "div";
                        node.properties = { className: ["mermaid"] };
                        node.children = svgChildren;
                    } catch (error) {
                        // console.error("Mermaid rendering failed: ", error);
                    }
                })(),
            );
        });

        await Promise.all(promises);
        return tree;
    };
};

export const useProcessMarkdown = (markdown: string) => {
    const [processedContent, setProcessedContent] = useState("");

    useEffect(() => {
        const process = async () => {
            try {
                const file = await unified()
                    .use(remarkParse)
                    .use(remarkGfm)
                    .use(remarkRehype)
                    .use(rehypeMermaid)
                    .use(rehypePrettyCode)
                    .use(rehypeStringify, { closeEmptyElements: true })
                    .process(markdown);

                setProcessedContent(String(file));
            } catch (error) {
                console.error("Markdown processing failed: ", error);
                setProcessedContent(markdown);
            }
        };

        process();
    }, [markdown]);

    return processedContent;
};