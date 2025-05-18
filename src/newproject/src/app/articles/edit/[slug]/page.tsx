import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EditArticle from "./EditArticle";
import { headers } from "next/headers";
import logger from "@/lib/logger";

type Props = {
    params: { slug: string };
};

const EditArticlePage: React.FC<Props> = async ({ params }) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const headersList = await headers();
    const requestUrl = headersList.get("x-request-url") || undefined;
    const userLogger = logger.child({ userId, url: requestUrl, event: "EditArticlePage" });
    userLogger.info({});

    if (!session || !session.user) {
        userLogger.warn({}, "未認証のリクエスト");
        redirect("/api/auth/signin");
    }

    const { slug } = await params;

    return (
        <EditArticle params={{ slug }} />
    );
};

export default EditArticlePage;