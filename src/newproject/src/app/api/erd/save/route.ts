"use server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
    try {
        const { name, nodes, edges } = await request.json();
        if (!name || !nodes || !edges) {
            return new Response(JSON.stringify({ success: false, error: "名前とデータは必須です" }), { status: 400 });
        }

        const dir = join(process.cwd(), "erd");
        await mkdir(dir, { recursive: true });
        const filePath = join(dir, `${name}.json`);
        await writeFile(filePath, JSON.stringify({ nodes, edges }, null, "\t"), "utf-8");

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("保存エラー:", error);
        return new Response(JSON.stringify({ success: false, error: "保存に失敗しました" }), { status: 500 });
    }
}