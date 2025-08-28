"use client";

import { redirect } from "next/navigation";
import React from "react";
import EditArticle from "./EditArticle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Props = {
    params: { slug: string };
};

const EditArticlePage: React.FC<Props> = async ({ params }) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <EditArticle params={params} />
    );
};

export default EditArticlePage;