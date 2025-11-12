import { visit } from "unist-util-visit";
import type { Root as HastRoot, Element } from 'hast';

const rehypeCodeCopyButton = () => {
    return async (tree: HastRoot) => {
        const promises: Promise<void>[] = [];

        visit(tree, "element", (node: Element) => {
            if (node.tagName !== "figure" || !node.children[0]) return;

            const preElm = node.children[0] as Element;
            if (preElm.tagName !== "pre" || !preElm.children[0]) return;

            promises.push((async () => {
                node.properties = { className: ["relative"] };
                preElm.properties = { className: ["group"] };
                preElm.children.push({
                    type: "element",
                    tagName: "button",
                    properties: {
                        onclick: [
                            "const range = document.createRange();",
                            "range.selectNodeContents(this.previousElementSibling);",
                            "const selection = window.getSelection();",
                            "selection.removeAllRanges();",
                            "selection.addRange(range);",
                            `document.execCommand("copy");`,
                            `this.lastElementChild.style.display = "block";`,
                            `setTimeout(() => {this.lastElementChild.style.display = "none";}, 1000);`,
                        ].join(""),
                        class: [
                            "hidden group-hover:flex p-1 m-1 absolute top-0 right-0 cursor-pointer",
                            "rounded-md bg-black border-2 border-cyan-200 text-cyan-200 fill-cyan-200",
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
                                class: "absolute right-[100%] mr-1 px-1 bg-black text-white hidden",
                            },
                            children: [{ type: "text", value: "コピーしました" }],
                        },
                    ],
                });
            })());
        });
    };
};

export default rehypeCodeCopyButton;