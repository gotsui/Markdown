"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    isSignedIn: boolean;
    currentFilters: ArticleFilter;
};

const visibilityOptions: { value: Visibility; label: string }[] = [
    { value: "PUBLIC", label: "公開" },
    { value: "PRIVATE", label: "非公開" },
    { value: "DRAFT", label: "下書き" },
];

const sortOptions: { value: SortBy; label: string }[] = [
    { value: "createdAt", label: "作成日" },
    { value: "updatedAt", label: "更新日" },
    { value: "title", label: "タイトル" },
];

const orderOptions: { value: SortOrder; label: string }[] = [
    { value: "asc", label: "昇順" },
    { value: "desc", label: "降順" },
];

const FilterForm: React.FC<Props> = ({ isSignedIn, currentFilters }) => {
    const router = useRouter();
    const [visibilities, setVisibilities] = useState<Visibility[]>(currentFilters.visibilities || visibilityOptions.map((v) => v.value));
    const [search, setSearch] = useState(currentFilters.search || "");
    const [author, setAuthor] = useState(currentFilters.author || "");
    const [onlyMyArticles, setOnlyMyArticles] = useState(currentFilters.onlyMyArticles || false);
    const [onlyFavorites, setOnlyFavorites] = useState(currentFilters.onlyFavorites || false);
    const [sortBy, setSortBy] = useState<SortBy>(currentFilters.sortBy || "createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>(currentFilters.sortOrder || "desc");

    const handleVisibilityChange = (value: Visibility, checked: boolean) => {
        setVisibilities((prev) => checked ? [...prev, value] : prev.filter((v) => v !== value));
    };

    const handleFilterChange = () => {
        const params = new URLSearchParams();

        if (visibilities.length > 0 && visibilities.length < visibilityOptions.length) {
            params.set("visibilities", visibilities.join(","));
        } else {
            params.delete("visibilities");
        }

        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }

        if (author) {
            params.set("author", author);
        } else {
            params.delete("author");
        }

        if (onlyMyArticles) {
            params.set("onlyMyArticles", onlyMyArticles.toString());
        } else {
            params.delete("onlyMyArticles");
        }

        if (onlyFavorites) {
            params.set("onlyFavorites", onlyFavorites.toString());
        } else {
            params.delete("onlyFavorites");
        }

        if (sortBy !== "createdAt") {
            params.set("sortBy", sortBy);
        } else {
            params.delete("sortBy");
        }

        if (sortOrder !== "desc") {
            params.set("sortOrder", sortOrder);
        } else {
            params.delete("sortOrder");
        }

        router.push(`/articles?${params.toString()}`);
    };

    return (
        <div className="mb-6 p-4 rounded-lg">
            <details className="border bg-gray-100 rounded-lg p-4 mb-2" open>
                <summary className="cursor-pointer font-semibold text-lg flex items-center">
                    <span className="mr-2">メタデータ</span>
                    <svg
                        className="w-5 h-5 transform transition-transform duration-200 [&[open]]:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>
                <div className="flex flex-col gap-4 mt-2">
                    {isSignedIn &&
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
                    }
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
                        <label className="block text-sm font-medium mb-1">作成者</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="作成者を入力"
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    {isSignedIn &&
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
                    }
                    {isSignedIn &&
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={onlyFavorites}
                                    onChange={(e) => setOnlyFavorites(e.target.checked)}
                                    className="mr-2"
                                />
                                お気に入りのみ表示
                            </label>
                        </div>
                    }
                    <div>
                        <label className="block text-sm font-medium mb-1">並べ替え</label>
                        <div className="flex gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className="p-2 border rounded"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                                className="p-2 border rounded"
                            >
                                {orderOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleFilterChange}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        適用
                    </button>
                </div>
            </details>
        </div>
    );
};

export default FilterForm;