"use server";
import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
    }

    try {
        const filePath = join(process.cwd(), "erd", `${name}.json`);
        const fileContent = await readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        console.error("読み込みエラー:", error);
        return NextResponse.json({ error: "読み込みに失敗しました" }, { status: 500 });
    }
}