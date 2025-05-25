"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    currentFilters: ArticleFilter;
};

const visibilityOptions: { value: Visibility; label: string }[] = [
    { value: "PUBLIC", label: "公開" },
    { value: "PRIVATE", label: "非公開" },
    { value: "DRAFT", label: "下書き" },
];

const FilterForm: React.FC<Props> = ({ currentFilters }) => {
    const router = useRouter();
    const [visibilities, setVisibilities] = useState<Visibility[]>(currentFilters.visibilities || visibilityOptions.map((v) => v.value));
    const [search, setSearch] = useState(currentFilters.search || "");
    const [author, setAuthor] = useState(currentFilters.author || "");
    const [onlyMyArticles, setOnlyMyArticles] = useState(currentFilters.onlyMyArticles || false);

    const handleVisibilityChange = (value: Visibility, checked: boolean) => {
        setVisibilities((prev) => checked ? [...prev, value] : prev.filter((v) => v !== value));
    };

    const handleFilterChange = () => {
        const params = new URLSearchParams();

        if (visibilities.length > 0 && visibilities.length < visibilityOptions.length) {
            params.set("visibilities", visibilities.join(","));
        }

        if (search) {
            params.set("search", search);
        }

        if (author) {
            params.set("author", author);
        }

        if (onlyMyArticles) {
            params.set("onlyMyArticles", onlyMyArticles.toString());
        }

        router.push(`/articles?${params.toString()}`);
    };

    return (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex flex-col gap-4" >
                <div>
                    <label className="block text-sm font-medium mb-1">公開範囲</label>
                    <div className="flex flex-wrap gap-4">
                        {visibilityOptions.map((option) => (
                            <label key={option.value} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={visibilities.includes(option.value)}
                                    onChange={(e) => handleVisibilityChange(option.value, e.target.checked)}
                                    className="mr-2"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">タイトルまたは概要</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="キーワードを入力"
                        className="p-2 border rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">著者名</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="著者名を入力"
                        className="p-2 border rounded w-full"
                    />
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={onlyMyArticles}
                            onChange={(e) => setOnlyMyArticles(e.target.checked)}
                            className="mr-2"
                        />
                        自分のドキュメントのみ表示
                    </label>
                </div>
                <button
                    onClick={handleFilterChange}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    適用
                </button>
            </div>
        </div>
    );
};

export default FilterForm;