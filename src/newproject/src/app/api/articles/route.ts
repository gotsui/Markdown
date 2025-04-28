import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { error } from "console";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
        // 単一の記事を取得
        try {
            const article = await prisma.article.findUnique({ where: { slug }});

            if (!article) {
                return NextResponse.json({ error: "Article not found" }, { status: 404 });
            }

            if (
                article.visibility !== "PUBLIC" &&
                (!session || !session.user || (article.authorId !== session.user.id && session.user.role !== "ADMIN"))
            ) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

            return NextResponse.json(article, { status: 200 });
        } catch (error) {
            console.error("Error fetching article:", error);
            return NextResponse.json({ error: "Failed to fetch article"}, { status: 500 });
        }
    }

    // 記事一覧を取得
    const whereClause: { OR: Prisma.ArticleWhereInput[] } = {
        OR: [{ visibility: "PUBLIC" }],
    };

    if (session && session.user) {
        whereClause.OR.push({ authorId: session.user.id });
    }

    try {
        const articles = await prisma.article.findMany({ where: whereClause });
        return NextResponse.json(articles);
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const { title, slug, description, visibility, authorId } = await req.json();

        if (authorId !== session.user.id && session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                description,
                visibility,
                authorId,
            },
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        console.error("Error creating article:", error);
        return NextResponse.json({ error: "Failed to create article"}, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { originalSlug, title, slug, visibility } = await req.json();
        const article: Article = await prisma.article.findUnique({ where: { slug: originalSlug }});

        if (!article || (article.authorId !== session.user.id && session.user.role !== "ADMIN")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (slug !== originalSlug) {
            const existingArticle = await prisma.article.findUnique({ where: { slug }});

            if (existingArticle) {
                return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
            }
        }

        const updatedArticle = await prisma.article.update({
            where: { slug: originalSlug },
            data: {
                title,
                slug,
                visibility,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedArticle, { status: 200 });
    } catch (error) {
        console.error("Error updating article:", error);
        return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
    }
}