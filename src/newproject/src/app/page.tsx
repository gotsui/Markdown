import Link from "next/link";

const HomePage = () => {
    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-4xl font-bold mb-4">ようこそ</h1>
            <p className="text-lg mb-4">Create and share your articles with the world!</p>
            <div className="grid grid-cols-3 gap-4">
                <Link
                    href="/articles"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    記事一覧
                </Link>
                <Link
                    href="/mermaid"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    mermaidエディタ
                </Link>
                <Link
                    href="/mermaidtable"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    tsv-mermaidテーブル変換
                </Link>
                <Link
                    href="/tree"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    ツリーエディタ
                </Link>
                <Link
                    href="/xyflow"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    ER図エディタ
                </Link>
            </div>
        </div>
    );
};

export default HomePage;