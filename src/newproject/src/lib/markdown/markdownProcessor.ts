"use client";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSanitize from 'rehype-sanitize';
import rehypeMermaid from "./rehypeMarmaid";
import rehypeSlug from 'rehype-slug';

export const parse = async (content: string): Promise<string> => {
    try {
        const file = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeSlug)
            .use(rehypeSanitize)
            .use(rehypeMermaid)
            .use(rehypePrettyCode)
            .use(rehypeStringify, { closeEmptyElements: true })
            .process(content);

        return file.toString();
    } catch (error) {
        return content;
    }
};
