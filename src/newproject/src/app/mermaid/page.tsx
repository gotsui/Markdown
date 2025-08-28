"use client";

import MarkdownContext from "@/content/MarkdownContent";
import useMarkdown from "@/hooks/useMarkdown";
import SplitLayout from "./SplitLayout";

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

const TestPage = () => {
    const markdownContent = useMarkdown(content);

    return (
        <MarkdownContext value={markdownContent}>
            <div className="h-[calc(100vh-132px)]">
                <SplitLayout />
            </div>
        </MarkdownContext>
    );
};

export default TestPage;