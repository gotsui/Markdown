"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from "@/lib/logger";
import { saveMarkdown } from "@/lib/markdown";
import { Visibility } from "@prisma/client";
import { extname } from "path";
import { headers } from "next/headers";

export async function uploadFile(formData: FormData) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const headersList = await headers();
    const requestUrl = headersList.get("x-request-url") || undefined;
    const userLogger = logger.child({ userId, url: requestUrl, event: "uploadFile" });

    if (!session?.user?.id) {
        userLogger.warn({}, "未認証のアップロード試行");
        return { error: "ログインしてください"};
    }

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const visibility = formData.get("visibility") as Visibility;

    if (!file || !title || !slug || !visibility) {
        userLogger.error({ fields: { file, title, slug, visibility } }, "必須フィールドが不足");
        return { error: "必須フィールドを入力してください" };
    }

    const validMimeTypes = ["text/markdown", "application/octet-stream"];
    const fileExtension = extname(file.name).toLowerCase();

    if (!validMimeTypes.includes(file.type) || fileExtension !== ".md") {
        userLogger.error({ fileType: file.type, fileName: file.name }, "無効なファイル形式");
        return { error: "Markdownファイル（.md）を選択してください" };
    }

    let content: string;

    try {
        const buffer = await file.arrayBuffer();
        content = Buffer.from(buffer).toString("utf-8");

        if (!content || content.length === 0) {
            userLogger.error({ fileName: file.name }, "空のファイル");
            return { error: "ファイルが空です。内容を含むMarkdownファイルを選択してください" };
        }
    } catch (error) {
        userLogger.error({ fileName: file.name, error }, "ファイルの読み込みに失敗");
        return { error: "ファイルの読み込みに失敗しました。別のファイルを選択してください" };
    }

    try {
        const existingArticle = await prisma.article.findUnique({ where: { slug }});

        if (existingArticle) {
            userLogger.error({ slug }, "スラッグ重複");
            return { error: "このスラッグは既に使用されています" };
        }

        await saveMarkdown(slug, content);

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                description,
                visibility,
                authorId: session.user.id,
            },
        });

        userLogger.info({ articleId: article.id, slug }, "記事をアップロード");
        revalidatePath("/articles");
        return { success: true, article };
    } catch (error) {
        userLogger.error({ error, slug }, "記事アップロードに失敗");
        return { error: "アップロードに失敗しました" };
    }
}