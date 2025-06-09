"use server";
import { readdir } from "fs/promises";
import { join } from "path";

export async function GET() {
    try {
        const dir = join(process.cwd(), "erd");
        const files = await readdir(dir);
        const diagrams = files
            .filter((file) => file.endsWith(".json"))
            .map((file) => file.replace(".json", ""));
        return new Response(JSON.stringify({ success: true, diagrams }), { status: 200 });
    } catch (error) {
        console.error("一覧取得エラー:", error);
        return new Response(JSON.stringify({ success: false, error: "一覧取得に失敗しました" }), { status: 500 });
    }
}