"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

type MermaidProps = {
    code: string;
};

const Mermaid: React.FC<MermaidProps> = ({ code }) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const diagramId = React.useId();

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            logLevel: 'debug',
        });

        const renderMermaid = async () => {
            try {
                const { svg } = await mermaid.render(diagramId, code);
                setSvgContent(svg);
                setError(null);
            } catch (renderError) {
                console.error('Mermaid rendering error:', renderError);
                setError('Failed to render Mermaid diagram');
                setSvgContent(null);
            }
        };

        renderMermaid();
    }, [code]);

    // エラー表示
    if (error) {
        return <div className="mermaid text-red-500">{error}</div>;
    }

    // ローディング表示
    if (!svgContent) {
        return <div className="mermaid">Loading diagram...</div>;
    }

    // SVGレンダリング
    return <div className="mermaid" dangerouslySetInnerHTML={{ __html: svgContent }} />;
};

export default Mermaid;