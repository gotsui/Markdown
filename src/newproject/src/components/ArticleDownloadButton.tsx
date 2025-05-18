"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
    slug: string;
};

const ArticleDownloadButton: React.FC<Props> = ({ slug }) => {
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!session?.user?.id) {
            setError("ログインしてください");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/articles/download?slug=${slug}`);

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "ダウンロードに失敗しました");
                setIsLoading(false);
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${slug}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setIsLoading(false);
        } catch (error) {
            setError("ダウンロードに失敗しました");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleDownload}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                disabled={isLoading}
            >
                {isLoading ? "ダウンロード中..." : "ダウンロード"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default ArticleDownloadButton;