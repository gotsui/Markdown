"use client";

import { useContext } from "react";
import MarkdownContext from "@/content/MarkdownContent";

const MarkdownPreview = () => {
    const context = useContext(MarkdownContext);

    if (!context) {
        throw new Error("MarkdownPreview must be used within a MarkdownContext");
    }

    const { parsed } = context;

    return (
        <div className="prose" dangerouslySetInnerHTML={{ __html: parsed }} />
    );
};

export default MarkdownPreview;
