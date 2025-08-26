"use client";

import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";

const SplitLayout = () => {
    return (
        <div className="flex flex-col md:flex-row h-full border-b">
            <div className="w-full md:w-1/2 border-r">
                <MarkdownEditor />
            </div>
            <div className="w-full md:w-1/2">
                <MarkdownView />
            </div>
        </div>
    );
};

export default SplitLayout;
