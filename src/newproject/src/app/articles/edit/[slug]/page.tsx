import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EditArticle from "./EditArticle";

type Props = {
    params: { slug: string };
};

const EditArticlePage: React.FC<Props> = async ({ params }) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const { slug } = await params;

    return (
        <EditArticle params={{ slug }} />
    );
};

export default EditArticlePage;