"use client";

export type TocItem = {
    id: string;
    text: string;
    depth: number;
};

type TableOfContentsProps = {
    tocItems: TocItem[];
};

// インデントのマッピング（Tailwind クラス）
const indentClasses: { [key: number]: string } = {
    0: "ml-0",
    4: "ml-4",
    8: "ml-8",
    12: "ml-12",
    16: "ml-16",
    20: "ml-20",
};

const TableOfContents = ({
    tocItems,
}: TableOfContentsProps) => {
    return (
        <nav className="toc mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">目次</h2>
            <ul className="list-none">
                {tocItems.map((item) => (
                    <li
                        key={item.id}
                        className={`${indentClasses[(item.depth - 1) * 4] || 'ml-0'} mb-1`}
                    >
                        <a
                            href={`#${item.id}`}
                            className="text-blue-600 hover:underline"
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;