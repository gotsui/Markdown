import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NewArticle from "./NewArticle";

const NewArticlePage: React.FC = async () => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <NewArticle />
    );
};

export default NewArticlePage;