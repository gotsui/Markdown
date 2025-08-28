import Link from "next/link";

const HomePage = () => {
    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-4xl font-bold mb-4">ようこそ</h1>
            <p className="text-lg mb-4">Create and share your articles with the world!</p>
            <Link
                href="/articles"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                記事一覧
            </Link>
        </div>
    );
};

export default HomePage;