"use client";

import { useState } from "react";

const templateSvg = `<svg xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="100" height="60" fill="#ddd" />
    <polygon points="50 10, 70 30, 50 50, 30 30" fill="#99f" />
</svg>
`;

const convert = (svg: string) => {
    const encoded = encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
    const base64 = btoa(encoded);
    return base64;
};

const Page = () => {
    const [svg, setSvg] = useState(templateSvg);
    const [base64, setBase64] = useState(convert(templateSvg));

    const handleClickConvert = () => {
        setBase64(convert(svg));
    };

    return (
        <div className="size-full flex flex-col gap-4 p-4">
            <textarea
                className="flex-1 w-full border p-2 resize-none"
                value={svg}
                onChange={(e) => setSvg(e.target.value)}
                spellCheck={false}
            />
            <button
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                onClick={handleClickConvert}
            >
                変換
            </button>
            <div className="flex-1">{`<img src="data:image/svg+xml;base64,${base64}" alt="" width="200" height="200"></img>`}</div>
            <img src={`data:image/svg+xml;base64,${base64}`} alt="" width="200" height="200"></img>
        </div>
    );
};

export default Page;