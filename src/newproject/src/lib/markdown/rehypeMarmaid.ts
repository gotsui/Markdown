import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import mermaid from "mermaid";
import type { Root as HastRoot, Element, ElementContent } from 'hast';
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

                        node.tagName = "div";
                        node.properties = { className: ["mermaid"] };
                        node.children = svgChildren;
                    } catch (error) {
                        return;
                    }
                })(),
            );
        });

        await Promise.all(promises);
        return tree;
    };
};

export default rehypeMermaid;
