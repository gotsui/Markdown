"use client";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeMermaid from "./rehypeMarmaid";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { ShikiTransformer } from "shiki";
import { v4 as uuidv4 } from "uuid";
// import "./copy.css";

export const parse = async (content: string): Promise<string> => {
    try {
        const file = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeSlug)
            .use(rehypeSanitize)
            .use(rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: "no-underline" } })
            .use(rehypeMermaid)
            .use(rehypePrettyCode, { theme: "github-dark", transformers: [transformShikiCodeBlockCopyButton()] })
            .use(rehypeStringify, { closeEmptyElements: true })
            .process(content);

        return file.toString();
    } catch (error) {
        return content;
    }
};

const transformShikiCodeBlockCopyButton = (): ShikiTransformer => {
    return {
        name: "transformShikiCodeBlockCopyButton",

        // 生成後の <pre> 要素を編集する
        pre(node) {

            // コピーボタンを追加するためにまず親を position: relative する
            node.properties.class = "relative group copy-anchor-scope";

            const popoverId = uuidv4();

            // コピーボタンを差し込む
            node.children.push(
                {
                    type: "element",
                    tagName: "button",
                    properties: {
                        data: this.source,
                        onclick: /* javascript */ `navigator.clipboard.writeText(this.attributes.data.value);document.getElementById("${popoverId}").style.display="block";setTimeout(() => {document.getElementById("${popoverId}").style.display="none";},3000);`,
                        class: [
                            "hidden group-hover:flex p-1 m-1 absolute top-0 right-0 cursor-pointer",
                            "rounded-md bg-black border-2 border-cyan-200 text-cyan-200 fill-cyan-200",
                            "copy-anchor",
                        ].join(" "),
                    },
                    children: [
                        {
                            type: "element",
                            tagName: "svg",
                            properties: {
                                xmlns: "http://www.w3.org/2000/svg",
                                height: "24",
                                viewBox: "0 -960 960 960",
                                width: "24"
                            },
                            children: [
                                {
                                    type: "element",
                                    tagName: "path",
                                    properties: {
                                        // アイコンは https://fonts.google.com/icons より
                                        d: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"
                                    },
                                    children: []
                                }
                            ]
                        },
                        {
                            type: "element",
                            tagName: "div",
                            properties: {
                                id: popoverId,
                                class: "absolute right-[100%] mr-1 px-1 bg-black text-white hidden",
                            },
                            children: [{ type: "text", value: "コピーしました" }],
                        }
                    ],
                }
            );
        }
    }
};
