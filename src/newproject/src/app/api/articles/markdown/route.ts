import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { readMarkdown, saveMarkdown } from "@/lib/markdown";
import { error } from "console";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({ where: { slug }});

        if (!article || (article.authorId !== session.user.id && session.user.role !== "ADMIN")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const content = await readMarkdown(slug);
        return NextResponse.json({ content }, { status: 200 });
    } catch (error) {
        console.error("Error reading markdown:", error);
        return NextResponse.json({ error: "Failed to read markdown" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { slug, content } = await req.json();
        const article = await prisma.article.findUnique({ where: { slug }});

        if (!article || (article.authorId !== session.user.id && session.user.role !== "ADMIN")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await saveMarkdown(slug, content);
        return NextResponse.json({ message: "Markdown saved" }, { status: 200 });
    } catch (error) {
        console.error("Error saving markdown:", error);
        return NextResponse.json({ error: "Failed to save markdown" }, { status: 500 });
    }
}