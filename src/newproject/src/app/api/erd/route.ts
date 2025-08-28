import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { ERNode, EREdge } from "../../xyflow/types/erd";

const DATA_FILE = path.join(process.cwd(), "erd", "erd.json");

export async function GET() {
    try {
        const fileContent = await fs.readFile(DATA_FILE, "utf-8");
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading erd.json:", error);
        return NextResponse.json({ nodes: [], edges: [] }, { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const { nodes, edges }: { nodes: ERNode[]; edges: EREdge[] } = await request.json();
        await fs.writeFile(DATA_FILE, JSON.stringify({ nodes, edges }, null, "\t"), "utf-8");
        return NextResponse.json({ message: "Data saved successfully" });
    } catch (error) {
        console.error("Error writing erd.json:", error);
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}