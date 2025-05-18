import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NewArticle from "./NewArticle";
import { headers } from "next/headers";
import logger from "@/lib/logger";

const NewArticlePage: React.FC = async () => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const headersList = await headers();
    const requestUrl = headersList.get("x-request-url") || undefined;
    const userLogger = logger.child({ userId, url: requestUrl, event: "NewArticlePage" });
    userLogger.info({});

    if (!session || !session.user) {
        userLogger.warn({}, "未認証のリクエスト");
        redirect("/api/auth/signin");
    }

    return (
        <NewArticle />
    );
};

export default NewArticlePage;