"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
    articleId: string;
    isInitialFavorited: boolean;
};

const FavoriteButton: React.FC<Props> = ({ articleId, isInitialFavorited }) => {
    const { data: session, status } = useSession();
    const [isFavorited, setIsFavorited] = useState(isInitialFavorited);
    const [isLoading, setIsLoading] = useState(false);

    // 初期状態を同期
    useEffect(() => {
        setIsFavorited(isInitialFavorited);
    }, [isInitialFavorited]);

    const toggleFavorite = async () => {
        if (status !== "authenticated") {
            alert("お気に入り機能を使用するにはログインしてください");
            return;
        }

        setIsLoading(true);

        try {
            const method = isFavorited ? "DELETE" : "POST";
            const res = await fetch("/api/favorites", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId }),
            });

            if (res.ok) {
                setIsFavorited(!isFavorited);
            } else {
                alert(`お気に入りの${isFavorited ? "解除" : "追加"}に失敗しました`);
            }
        } catch (error) {
            alert("エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={status !== "authenticated" || isLoading}
            className={`mt-2 flex items-center gap-1 ${
                isFavorited ? "text-red-500" : "text-gray-500"
            } hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed`}
        >
            {isFavorited ? "♥" : "♡"} お気に入り
        </button>
    )
};

export default FavoriteButton;