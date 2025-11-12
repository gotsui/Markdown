import { isAuthorOrAdmin } from "@/lib/auth";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

type EditButtonProps = {
    slug: string;
    authorId: string;
    session: Session | null;
};

const EditButton: React.FC<EditButtonProps> = ({ slug, authorId, session }) => {
    if (!session?.user || !isAuthorOrAdmin(authorId, session)) {
        return null;
    }

    return (
        <Link
            href={`/articles/edit/${slug}`}
            className="inline-block p-2 w-full text-sm text-center bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            編集
        </Link>
    );
};

export default EditButton;