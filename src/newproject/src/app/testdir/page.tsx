import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringfy from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";

const content = `
# title

## title2

### title 3

#### title4

##### title5

###### title6

## table

|A|B|C|
|-|-|-|
|1|2|3|
|4|5|6|

## code

\`\`\`java
class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;  
    C-->D;
\`\`\`
`;

const TestPage = async () => {
    const parsedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypePrettyCode)
        .use(rehypeStringfy)
        .process(content);

    return (
        <div className="prose">
            <div dangerouslySetInnerHTML={{ __html: parsedContent.toString() }} />
        </div>
    );
};

export default TestPage;